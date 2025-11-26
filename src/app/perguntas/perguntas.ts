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

  escolherAlternativa(i: number) {
    if (this.selecionada !== null) return; // impede clicar mais de uma vez

    this.selecionada = i;
    this.correta = this.perguntaAtual().correta;

    this.service.responder(i);

    // espera 1.2s para ir à próxima
    setTimeout(() => {
      this.selecionada = null;
      this.correta = null;
    }, 1200);
  }
}

