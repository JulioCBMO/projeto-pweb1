import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerguntasService } from '../services/perguntas.service';

@Component({
  selector: 'app-perguntas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perguntas.html',
  styleUrls: ['./perguntas.css'],
})
export class PerguntasComponent {
  selecionada = signal<number | null>(null);
  correta = signal<number | null>(null);

  constructor(public service: PerguntasService) {}

  // Getter seguro para evitar erros de undefined
  get pergunta() {
    const lista = this.service.perguntas();
    const index = this.service.perguntaAtual();
    return lista && lista[index] ? lista[index] : null;
  }

  escolherAlternativa(index: number) {
    if (!this.pergunta) return;

    this.selecionada.set(index);
    this.correta.set(this.pergunta.correta);

    setTimeout(() => {
      this.service.proximaPergunta();
      this.selecionada.set(null);
      this.correta.set(null);
    }, 1000);
  }
}
