import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Pergunta } from '../models/pergunta.model';

@Injectable({
  providedIn: 'root'
})
export class PerguntasService {
  private readonly API_URL = 'http://localhost:8080/api/consultas/perguntas';

  perguntas: WritableSignal<Pergunta[]> = signal([]);
  carregando = signal(false);

  constructor(private http: HttpClient) {
    this.carregarPerguntasDoBackend();
  }

  async carregarPerguntasDoBackend() {
    this.carregando.set(true);
    try {
      const dados = await lastValueFrom(this.http.get<Pergunta[]>(this.API_URL));
      this.perguntas.set(dados || []);
      console.log('Perguntas carregadas do Java:', dados);
    } catch (erro) {
      console.error('Erro ao buscar perguntas do backend:', erro);
      this.perguntas.set([]);
    } finally {
      this.carregando.set(false);
    }
  }
}