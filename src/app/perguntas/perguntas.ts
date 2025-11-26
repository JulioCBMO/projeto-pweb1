import { Component, inject } from '@angular/core';
import { PerguntasService } from '../services/perguntas.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-perguntas',
  standalone: true,
  templateUrl: './perguntas.html',
  styleUrls: ['./perguntas.css']
})
export class PerguntasComponent {

  service = inject(PerguntasService);

  perguntas = this.service.perguntas;
  perguntaAtual = this.service.perguntaAtual;

  responder(indice: number) {
    this.service.responder(indice);
  }
}



