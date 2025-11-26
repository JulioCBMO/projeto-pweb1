// src/app/services/perguntas.service.ts
import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

export interface Pergunta {
  texto: string;
  alternativas: string[];
  correta: number;
  imagem?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class PerguntasService {
  // signals
  perguntas: WritableSignal<Pergunta[]> = signal([]);
  perguntaAtual: WritableSignal<number> = signal(0);
  pontuacao: WritableSignal<number> = signal(0);
  jogador: WritableSignal<string | null> = signal(null);

  // carregamento em andamento
  carregando = signal(false);

  constructor(private http: HttpClient, private router: Router) {}

  async loadFromAssets(): Promise<void> {
    if (this.perguntas().length) return; // já carregado
    this.carregando.set(true);
    try {
      const data = await firstValueFrom(this.http.get<Pergunta[]>('/assets/questions.json'));
      this.perguntas.set(data || []);
    } catch (err) {
      console.error('Erro ao carregar perguntas', err);
      this.perguntas.set([]);
    } finally {
      this.carregando.set(false);
    }
  }

  iniciar(jogadorNome?: string) {
    if (jogadorNome) this.jogador.set(jogadorNome);
    this.pontuacao.set(0);
    this.perguntaAtual.set(0);
  }

  // indice: índice da alternativa escolhida; -1 significa "nenhuma"/timeout/skip
  responder(indice: number) {
    const idx = this.perguntaAtual();
    const lista = this.perguntas();
    if (!lista || !lista[idx]) return;

    const correta = lista[idx].correta;
    if (indice === correta) {
      this.pontuacao.update(v => v + 1);
    }

    const proxima = idx + 1;
    if (proxima < lista.length) {
      this.perguntaAtual.set(proxima);
    } else {
      // fim do quiz
      // navegue para resultado
      this.router.navigate(['/resultado']);
    }
  }
}
