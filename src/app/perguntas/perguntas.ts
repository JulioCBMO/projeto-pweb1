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

<<<<<<< HEAD
  // Computed signal para pegar a pergunta baseada no índice atual
  perguntaAtual = computed(() => {
=======
  constructor(public service: PerguntasService) {}

  // Getter seguro para evitar erros de undefined
  get pergunta() {
>>>>>>> 91ccc8f1b6ffcb2c081db2e6f0835233c701e276
    const lista = this.service.perguntas();
    const index = this.service.perguntaAtual();
    return lista && lista[index] ? lista[index] : null;
  }

<<<<<<< HEAD
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
=======
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
>>>>>>> 91ccc8f1b6ffcb2c081db2e6f0835233c701e276
