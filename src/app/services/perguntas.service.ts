import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PerguntasService {

  perguntas = signal([
    {
      texto: 'Qual a capital da França?',
      alternativas: ['Paris', 'Roma', 'Londres'],
      correta: 0
    },
    {
      texto: 'Quanto é 2 + 2?',
      alternativas: ['3', '4', '5'],
      correta: 1
    }
  ]);

  perguntaAtual = signal(0);
  acertos = signal(0);

  constructor() {}

  responder(indice: number) {
    const atual = this.perguntas()[this.perguntaAtual()];

    if (indice === atual.correta) {
      this.acertos.update(v => v + 1);
    }

    this.perguntaAtual.update(v => v + 1);
  }
}
