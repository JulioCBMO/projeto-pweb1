import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PerguntasService } from '../services/perguntas.service'; // <--- Importação essencial

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private perguntasService: PerguntasService // <--- ADICIONE ESTA LINHA (com 'private')
  ) {
    this.form = this.fb.group({
      player: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  start() {
    if (this.form.valid) {
      const name = this.form.value.player;
      
      // Agora isso vai funcionar, pois injetamos no construtor acima
      this.perguntasService.iniciar(name);
      
      this.router.navigate(['/perguntas']);
    } else {
      this.form.markAllAsTouched();
    }
  }
}