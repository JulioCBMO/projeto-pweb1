import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Pergunta } from '../models/pergunta.model';

@Injectable({
  providedIn: 'root'
})
export class PerguntasService {
private readonly API_URL = 'https://fluffy-trout-x5vg6wgvgrvc6v-8080.app.github.dev/api/consultas/perguntas'; 
 perguntas: WritableSignal<Pergunta[]> = signal([]);
  perguntaAtual: WritableSignal<number> = signal(0);
  pontuacao: WritableSignal<number> = signal(0);
  jogador: WritableSignal<string | null> = signal(null);
  carregando = signal(false);

  constructor(private http: HttpClient, private router: Router) {
    this.carregarPerguntasDoBackend();
  }

  async carregarPerguntasDoBackend() {
    this.carregando.set(true);
    try {
      const dados = await lastValueFrom(this.http.get<Pergunta[]>(this.API_URL));
      this.perguntas.set(dados || []);
    } catch (erro) {
      console.error('Erro ao buscar perguntas do backend:', erro);
      this.perguntas.set([]);
    } finally {
      this.carregando.set(false);
    }
  }

  iniciar(jogadorNome?: string) {
    if (jogadorNome) this.jogador.set(jogadorNome);
    this.pontuacao.set(0);
    this.perguntaAtual.set(0);
    this.router.navigate(['/perguntas']);
  }

  responder(indiceEscolhido: number) {
    const lista = this.perguntas();
    const idx = this.perguntaAtual();

    if (!lista[idx]) return;

    if (indiceEscolhido === lista[idx].correta) {
      this.pontuacao.update(p => p + 1);
    }

    const proxima = idx + 1;
    if (proxima < lista.length) {
      this.perguntaAtual.set(proxima);
    } else {
      this.router.navigate(['/resultado']);
    }
  }
}