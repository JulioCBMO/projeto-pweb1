import { Injectable, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Pergunta } from '../models/pergunta.model';

@Injectable({
  providedIn: 'root'
})
export class PerguntasService {
  private readonly API_URL = 'http://localhost:8080/api/consultas';

  perguntas: WritableSignal<Pergunta[]> = signal([]);
  perguntaAtual: WritableSignal<number> = signal(0);
  pontuacao: WritableSignal<number> = signal(0);
  jogador: WritableSignal<string | null> = signal(null);
  carregando = signal(false);

  constructor(private http: HttpClient, private router: Router) {
    this.loadFromSpringBoot();
  }

  async loadFromSpringBoot(): Promise<void> {
    this.carregando.set(true);
    try {
      const data = await lastValueFrom(this.http.get<Pergunta[]>(this.API_URL));
      this.perguntas.set(data || []);
    } catch (err) {
      console.error(err);
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

    if (indice === lista[idx].correta) {
      this.pontuacao.update(v => v + 1);
    }

    const proxima = idx + 1;
    if (proxima < lista.length) {
      this.perguntaAtual.set(proxima);
    } else {
      this.router.navigate(['/resultado']);
    }
  }
}