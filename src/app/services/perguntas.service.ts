// src/app/services/perguntas.service.ts
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { Pergunta } from '../models/pergunta.model';
import { supabase } from '../config/supabase.config';

@Injectable({
  providedIn: 'root'
})
export class PerguntasService {
  perguntas: WritableSignal<Pergunta[]> = signal([]);
  perguntaAtual: WritableSignal<number> = signal(0);
  pontuacao: WritableSignal<number> = signal(0);
  jogador: WritableSignal<string | null> = signal(null);

  carregando = signal(false);

  constructor(private router: Router) {
    console.log('Serviço iniciado. Tentando carregar perguntas do Supabase...');
    this.loadFromSupabase();
  }

  /**
   * Carrega perguntas do Supabase
   */
  async loadFromSupabase(): Promise<void> {
    if (this.perguntas().length > 0) return;
    
    this.carregando.set(true);
    
    try {
      console.log('Buscando perguntas no Supabase...');

      // Faz a consulta na tabela 'perguntas'
      const { data, error } = await supabase
        .from('perguntas')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Erro do Supabase:', error);
        throw error;
      }

      console.log('Sucesso! Perguntas carregadas:', data);
      this.perguntas.set(data || []);
      
    } catch (err) {
      console.error('ERRO CRÍTICO AO CARREGAR DO SUPABASE:', err);
      this.perguntas.set([]); 
    } finally {
      this.carregando.set(false);
    }
  }

  /**
   * Método alternativo: carregar perguntas aleatórias
   */
  async loadRandomQuestions(limit: number = 10): Promise<void> {
    this.carregando.set(true);
    
    try {
      const { data, error } = await supabase
        .from('perguntas')
        .select('*')
        .limit(limit);

      if (error) throw error;

      // Embaralha as perguntas
      const shuffled = data?.sort(() => Math.random() - 0.5) || [];
      this.perguntas.set(shuffled);
      
    } catch (err) {
      console.error('Erro ao carregar perguntas aleatórias:', err);
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