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
  pontuacao = signal(0);

  constructor() {}

 responder(indice: number) {
  const atual = this.perguntaAtual();
  const pergunta = this.perguntas()[atual];

  if (indice === pergunta.correta) {
    this.pontuacao.set(this.pontuacao() + 1);
  }

  const proxima = atual + 1;

  if (proxima < this.perguntas().length) {
    this.perguntaAtual.set(proxima);
  } else {
    // acabou! vai para a tela de resultado
    this.router.navigate(['/resultado']);
  }
}
