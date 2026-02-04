import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AdminService } from '../services/admin.service';
import { AuthService } from '../services/auth.service';
import { Pergunta } from '../models/pergunta.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  // UI
  telaAtiva = signal<'lista' | 'criar' | 'editar'>('lista');
  perguntaSelecionada = signal<Pergunta | null>(null);

  // Form (signals — usados no HTML)
  texto = signal('');
  categoria = signal('');
  dificuldade = signal('');
  alternativas = signal<string[]>(['', '', '', '']);
  correta = signal(0);
  imagem = signal('');

  constructor(
    public adminService: AdminService,
    private authService: AuthService,
    private router: Router
  ) {}

  // Navegação
  irParaLista() {
    this.telaAtiva.set('lista');
    this.limparForm();
  }

  irParaCriar() {
    this.telaAtiva.set('criar');
    this.limparForm();
  }

  irParaEditar(pergunta: Pergunta) {
    this.telaAtiva.set('editar');
    this.perguntaSelecionada.set(pergunta);

    this.texto.set(pergunta.texto);
    this.categoria.set(pergunta.categoria);
    this.dificuldade.set(pergunta.dificuldade);
    this.alternativas.set([...pergunta.alternativas]);
    this.correta.set(pergunta.correta);
    this.imagem.set(pergunta.imagem ?? '');
  }

  // CRUD
  async salvarNova() {
    if (!this.validarForm()) {
      alert('Preencha os campos corretamente!');
      return;
    }

    const nova: Pergunta = {
      texto: this.texto(),
      categoria: this.categoria(),
      dificuldade: this.dificuldade(),
      alternativas: this.alternativas(),
      correta: this.correta(),
      imagem: this.imagem() || null
    };

    const ok = await this.adminService.criar(nova);
    if (ok) this.irParaLista();
  }

  async salvarEdicao() {
    const pergunta = this.perguntaSelecionada();
    if (!pergunta || !this.validarForm()) return;

    const atualizada: Pergunta = {
      id: pergunta.id,
      texto: this.texto(),
      categoria: this.categoria(),
      dificuldade: this.dificuldade(),
      alternativas: this.alternativas(),
      correta: this.correta(),
      imagem: this.imagem() || null
    };

    const ok = await this.adminService.atualizar(pergunta.id!, atualizada);
    if (ok) this.irParaLista();
  }

  async deletarPergunta(id: number) {
    if (confirm('Deseja excluir esta pergunta?')) {
      await this.adminService.deletar(id);
    }
  }

  // Helpers
  atualizarAlternativa(index: number, valor: string) {
    const copia = [...this.alternativas()];
    copia[index] = valor;
    this.alternativas.set(copia);
  }

  limparForm() {
    this.texto.set('');
    this.categoria.set('');
    this.dificuldade.set('');
    this.alternativas.set(['', '', '', '']);
    this.correta.set(0);
    this.imagem.set('');
    this.perguntaSelecionada.set(null);
  }

  validarForm(): boolean {
    if (this.texto().trim().length < 10) return false;
    if (!this.categoria() || !this.dificuldade()) return false;
    if (this.alternativas().filter(a => a.trim()).length < 2) return false;
    return true;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
