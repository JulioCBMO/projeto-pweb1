import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PerguntasService } from '../services/perguntas.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  form: FormGroup;
  modoAdmin = signal(false);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private perguntasService: PerguntasService,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      player: ['', [
        Validators.required,
        Validators.minLength(2),
        this.noSpecialCharactersValidator()
      ]]
    });
  }

  noSpecialCharactersValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      const pattern = /^[a-zA-Z0-9\s]*$/;
      if (!pattern.test(value)) {
        return { specialCharacters: true };
      }
      return null;
    };
  }

  toggleModo() {
    this.modoAdmin.update(v => !v);
    this.form.reset();
  }

  start() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valor = this.form.value.player;

    if (this.modoAdmin()) {
      // Login como Admin
      if (this.authService.loginAsAdmin(valor)) {
        this.router.navigate(['/admin']);
      } else {
        alert('Senha incorreta! Use: admin123');
      }
    } else {
      // Login como Usuário
      if (this.authService.loginAsUser(valor)) {
        this.perguntasService.iniciar(valor);
        this.router.navigate(['/perguntas']);
      }
    }
  }
}