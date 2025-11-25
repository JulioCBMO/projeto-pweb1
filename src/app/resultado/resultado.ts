import { Component, inject } from '@angular/core';
import { PerguntasService } from '../services/perguntas.service';

@Component({
  selector: 'app-resultado',
  standalone: true,
  templateUrl: './resultado.html',
  styleUrls: ['./resultado.css']
})
export class ResultadoComponent {

  service = inject(PerguntasService);

  pontuacao = this.service.pontuacao;
  total = this.service.perguntas;
}
