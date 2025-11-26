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

  // Computed signal para pegar a pergunta baseada no índice atual
  perguntaAtual = computed(() => {
    const lista = this.service.perguntas();
    const idx = this.service.perguntaAtual();
    return lista[idx];
  });

  // Controle visual
  selecionada: number | null = null;
  correta: number | null = null;

  escolherAlternativa(indiceEscolhido: number) {
    // Evita clique duplo
    if (this.selecionada !== null) return;

    this.selecionada = indiceEscolhido;
    this.correta = this.perguntaAtual().correta;

    

    // Espera 1.5 segundos para o usuário ver se acertou
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