import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perguntas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perguntas.html',
  styleUrls: ['./perguntas.css'],
})
export class Perguntas {
  playerName: string | null = null;

  constructor(private router: Router) {
    const state = this.router.getCurrentNavigation()?.extras?.state as any;
    this.playerName = state?.player ?? null;
  }
}
  


