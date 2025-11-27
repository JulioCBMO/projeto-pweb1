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
    console.log('Serviço iniciado. Tentando carregar perguntas...');
    this.loadFromAssets();
  }

  async loadFromAssets(): Promise<void> {
    if (this.perguntas().length > 0) return;
    
    this.carregando.set(true);
    
    try {
      // Adicionei a barra '/' no inicio para garantir a raiz
      const url = '/questions.json'; 
      console.log('Buscando em:', url);

      const data = await firstValueFrom(this.http.get<Pergunta[]>(url));
      
      console.log('Sucesso! Perguntas carregadas:', data);
      this.perguntas.set(data || []);
      
    } catch (err) {
      console.error('ERRO CRÍTICO AO CARREGAR JSON:', err);
      // Mantém vazio para a tela mostrar o erro se necessário
      this.perguntas.set([]); 
    } finally {
      this.carregando.set(false);
    }
  }

  iniciar(jogadorNome?: string) {
    if (jogadorNome) this.jogador.set(jogadorNome);
    
    // RESET OBRIGATÓRIO
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

    const proxima = idx + 1;
    if (proxima < lista.length) {
      this.perguntaAtual.set(proxima);
    } else {
      this.router.navigate(['/resultado']);
    }
  }
}