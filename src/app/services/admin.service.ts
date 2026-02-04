import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Pergunta } from '../models/pergunta.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private readonly API_PERGUNTAS =
    `${environment.apiBaseUrl}/api/perguntas`;

  private readonly API_CONSULTAS =
    `${environment.apiBaseUrl}/api/consultas`;

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
    } catch {
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
