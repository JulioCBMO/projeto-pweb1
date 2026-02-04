import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Pergunta } from '../models/pergunta.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  // Novo link do seu Codespaces
  private readonly BASE_URL = 'https://ideal-telegram-g4qwp6pxpjvpfpg9-8080.app.github.dev';

  // Endpoint do Módulo 1 (Criação/Edição)
  private readonly API_PERGUNTAS = `${this.BASE_URL}/api/perguntas`;

  // Endpoint do Módulo 2 (Listagem de Consultas)
  private readonly API_CONSULTAS = `${this.BASE_URL}/api/consultas/perguntas`;

  perguntas = signal<Pergunta[]>([]);
  carregando = signal(false);
  mensagem = signal('');

  constructor(private http: HttpClient) {}

  async carregarPerguntas(): Promise<void> {
    this.carregando.set(true);
    try {
      const data = await lastValueFrom(
        this.http.get<Pergunta[]>(this.API_CONSULTAS)
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
      // O Java espera 'texto' em vez de 'enunciado', garanta que o model está correto
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