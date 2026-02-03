import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Pergunta } from '../models/pergunta.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly API_URL = 'http://localhost:8080/api/perguntas';
  
  perguntas = signal<Pergunta[]>([]);
  carregando = signal(false);
  mensagem = signal('');

  constructor(private http: HttpClient) {}

  async carregarPerguntas(): Promise<void> {
    this.carregando.set(true);
    try {
      const data = await lastValueFrom(
        this.http.get<Pergunta[]>('http://localhost:8080/api/consultas')
      );
      this.perguntas.set(data || []);
    } catch (err) {
      console.error('Erro ao carregar perguntas:', err);
      this.mensagem.set('Erro ao carregar perguntas');
    } finally {
      this.carregando.set(false);
    }
  }

  async criar(pergunta: Pergunta): Promise<boolean> {
    this.carregando.set(true);
    try {
      const nova = await lastValueFrom(
        this.http.post<Pergunta>(this.API_URL, pergunta)
      );
      this.perguntas.update(lista => [...lista, nova]);
      this.mensagem.set('Pergunta criada com sucesso!');
      return true;
    } catch (err) {
      console.error('Erro ao criar pergunta:', err);
      this.mensagem.set('Erro ao criar pergunta');
      return false;
    } finally {
      this.carregando.set(false);
    }
  }

  async atualizar(id: number, pergunta: Pergunta): Promise<boolean> {
    this.carregando.set(true);
    try {
      const atualizada = await lastValueFrom(
        this.http.put<Pergunta>(`${this.API_URL}/${id}`, pergunta)
      );
      this.perguntas.update(lista => 
        lista.map(p => p.id === id ? atualizada : p)
      );
      this.mensagem.set('Pergunta atualizada com sucesso!');
      return true;
    } catch (err) {
      console.error('Erro ao atualizar pergunta:', err);
      this.mensagem.set('Erro ao atualizar pergunta');
      return false;
    } finally {
      this.carregando.set(false);
    }
  }

  async deletar(id: number): Promise<boolean> {
    this.carregando.set(true);
    try {
      await lastValueFrom(
        this.http.delete(`${this.API_URL}/${id}`)
      );
      this.perguntas.update(lista => lista.filter(p => p.id !== id));
      this.mensagem.set('Pergunta deletada com sucesso!');
      return true;
    } catch (err) {
      console.error('Erro ao deletar pergunta:', err);
      this.mensagem.set('Erro ao deletar pergunta');
      return false;
    } finally {
      this.carregando.set(false);
    }
  }
}