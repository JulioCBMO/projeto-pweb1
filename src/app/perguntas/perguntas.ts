import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerguntasService } from '../services/perguntas.service';

@Component({
  selector: 'app-perguntas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perguntas.html',
  styleUrl: './perguntas.css',
})
export class PerguntasComponent {
  service = inject(PerguntasService);

  perguntaAtual = computed(() => {
    const lista = this.service.perguntas();
    const idx = this.service.perguntaAtual();
    return lista.length > 0 ? lista[idx] : null;
  });

  selecionada: number | null = null;
  correta: number | null = null;

  escolherAlternativa(indiceEscolhido: number) {
    const pergunta = this.perguntaAtual();
    if (this.selecionada !== null || !pergunta) return;

    this.selecionada = indiceEscolhido;
    this.correta = pergunta.correta; 

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