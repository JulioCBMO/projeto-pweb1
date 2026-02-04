import { Injectable, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Pergunta } from '../models/pergunta.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PerguntasService {

  private readonly API_URL =
    `${environment.apiBaseUrl}/api/perguntas`;

  perguntas = signal<Pergunta[]>([]);
  perguntaAtual = signal(0);
  pontuacao = signal(0);
  jogador = signal<string | null>(null);
  carregando = signal(false);

  constructor(private http: HttpClient, private router: Router) {
    this.loadFromSpringBoot();
  }

  iniciar(jogadorNome?: string) {
    if (jogadorNome) {
      this.jogador.set(jogadorNome);
    }
    this.pontuacao.set(0);
    this.perguntaAtual.set(0);
  }

  async loadFromSpringBoot(): Promise<void> {
    this.carregando.set(true);
    try {
      const data = await lastValueFrom(
        this.http.get<Pergunta[]>(this.API_URL)
      );
      this.perguntas.set(data || []);
    } finally {
      this.carregando.set(false);
    }
  }

  responder(indice: number) {
    const atual = this.perguntaAtual();
    const lista = this.perguntas();

    if (indice === lista[atual].correta) {
      this.pontuacao.update(p => p + 1);
    }

    if (atual + 1 < lista.length) {
      this.perguntaAtual.update(v => v + 1);
    } else {
      this.router.navigate(['/resultado']);
    }
  }
}
