import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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
    private router: Router
  ) {
    this.form = this.fb.group({
      player: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  start() {
    if (this.form.valid) {
      const name = this.form.value.player;
      this.router.navigate(['/perguntas'], { state: { player: name } });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
