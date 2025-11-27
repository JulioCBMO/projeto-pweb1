import { Component, computed, inject } from '@angular/core';
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
  service = inject(PerguntasService);

  perguntaAtual = computed(() => {
    const lista = this.service.perguntas();
    const idx = this.service.perguntaAtual();
    return lista[idx];
  });

  selecionada: number | null = null;
  correta: number | null = null;

  escolherAlternativa(indiceEscolhido: number) {
    if (this.selecionada !== null) return;

    this.selecionada = indiceEscolhido;
    this.correta = this.perguntaAtual().correta;

    setTimeout(() => {
      this.service.responder(indiceEscolhido);
      this.resetarEstadoVisual();
    }, 1500);
  }

  resetarEstadoVisual() {
    this.selecionada = null;
    this.correta = null;
  }
}