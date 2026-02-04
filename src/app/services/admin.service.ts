import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Pergunta } from '../models/pergunta.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private readonly API_PERGUNTAS =
    `https://opulent-train-4jj79rr74qw52qqrw-8080.app.github.dev/api/perguntas`;

  private readonly API_CONSULTAS =
    `https://opulent-train-4jj79rr74qw52qqrw-8080.app.github.dev/api/consultas`;

  perguntas = signal<Pergunta[]>([]);
  carregando = signal(false);
  mensagem = signal('');

  constructor(private http: HttpClient) {}

  async carregarPerguntas(): Promise<void> {
    this.carregando.set(true);
    try {
      const data = await lastValueFrom(
        this.http.get<Pergunta[]>(this.API_PERGUNTAS)
      );
      this.perguntas.set(data || []);
    } catch (error) {
      console.error('Erro ao carregar perguntas no admin:', error);
    } finally {
      this.carregando.set(false);
    }
  }

  async criar(pergunta: Pergunta): Promise<boolean> {
    try {
    
      const nova = await lastValueFrom(
        this.http.post<Pergunta>(this.API_PERGUNTAS, pergunta)
      );
      this.perguntas.update(l => [...l, nova]);
      return true;
    } catch (error) {
      console.error('Erro ao criar pergunta:', error);
      return false;
    }
  }

  async atualizar(id: number, pergunta: Pergunta): Promise<boolean> {
    try {
      const atualizada = await lastValueFrom(
        this.http.put<Pergunta>(`${this.API_PERGUNTAS}/${id}`, pergunta)
      );
      this.perguntas.update(l =>
        l.map(p => p.id === id ? atualizada : p)
      );
      return true;
    } catch {
      return false;
    }
  }

  async deletar(id: number): Promise<boolean> {
    try {
      await lastValueFrom(
        this.http.delete(`${this.API_PERGUNTAS}/${id}`)
      );
      this.perguntas.update(l => l.filter(p => p.id !== id));
      return true;
    } catch {
      return false;
    }
  }
}