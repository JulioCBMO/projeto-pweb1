import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router'; // <--- Importe isto
import { PerguntasService } from '../services/perguntas.service';

@Component({
  selector: 'app-resultado',
  standalone: true,
  imports: [RouterModule], // <--- Adicione isto
  templateUrl: './resultado.html',
  styleUrls: ['./resultado.css']
})
export class ResultadoComponent {
  service = inject(PerguntasService);

  pontuacao = this.service.pontuacao;
  total = this.service.perguntas;
}