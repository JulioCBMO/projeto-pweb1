import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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
      player: ['', [
        Validators.required,
        Validators.minLength(2),
        this.noSpecialCharactersValidator()
      ]]
    });
  }

  /**
   * Validador customizado para rejeitar caracteres especiais
   * Aceita apenas: letras (a-z, A-Z), números (0-9) e espaços
   */
  noSpecialCharactersValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null; // Deixa para Validators.required verificar
      }
      // Regex: permite apenas letras (maiúsculas e minúsculas), números e espaços
      const pattern = /^[a-zA-Z0-9\s]*$/;
      if (!pattern.test(value)) {
        return { specialCharacters: true };
      }
      return null;
    };
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