import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { Pergunta } from '../models/pergunta.model';

@Injectable({
  providedIn: 'root'
})
export class PerguntasService {
  perguntas: WritableSignal<Pergunta[]> = signal([]);
  perguntaAtual: WritableSignal<number> = signal(0);
  pontuacao: WritableSignal<number> = signal(0);
  jogador: WritableSignal<string | null> = signal(null);

  carregando = signal(false);

  constructor(private http: HttpClient, private router: Router) {
    this.loadFromAssets();
  }

  async loadFromAssets(): Promise<void> {
    if (this.perguntas().length) return;
    this.carregando.set(true);

    try {
      const data = await firstValueFrom(
        this.http.get<Pergunta[]>('/assets/questions.json')
      );
      this.perguntas.set(data || []);
    } catch (err) {
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

  responder(indice: number) {
    const idx = this.perguntaAtual();
    const lista = this.perguntas();

    if (!lista || !lista[idx]) return;

    const correta = lista[idx].correta;

    if (indice === correta) {
      this.pontuacao.update(v => v + 1);
    }

    this.proximaPergunta();
  }

  proximaPergunta() {
    const atual = this.perguntaAtual();
    const lista = this.perguntas();
    const proxima = atual + 1;

    if (proxima < lista.length) {
      this.perguntaAtual.set(proxima);
    } else {
      this.router.navigate(['/resultado']);
    }
  }
}