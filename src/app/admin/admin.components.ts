import { Component, OnInit, signal } from '@angular/core';
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
export class AdminComponent implements OnInit {
  // Estado da UI
  telaAtiva = signal<'lista' | 'criar' | 'editar'>('lista');
  perguntaSelecionada = signal<Pergunta | null>(null);
  
  // Form data
  texto = signal('');
  alternativas = signal(['', '', '', '']);
  correta = signal(0);
  imagem = signal('');

  constructor(
    public adminService: AdminService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/']);
      return;
    }
    this.adminService.carregarPerguntas();
  }

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
    this.alternativas.set([...pergunta.alternativas]);
    this.correta.set(pergunta.correta);
    this.imagem.set(pergunta.imagem || '');
  }

  // CRUD Operations
  async salvarNova() {
    if (!this.validarForm()) {
      alert('Preencha todos os campos corretamente!');
      return;
    }

    const novaPergunta: Pergunta = {
      texto: this.texto(),
      alternativas: this.alternativas().filter(a => a.trim() !== ''),
      correta: this.correta(),
      imagem: this.imagem() || null
    };

    const sucesso = await this.adminService.criar(novaPergunta);
    if (sucesso) {
      this.irParaLista();
    }
  }

  async salvarEdicao() {
    const pergunta = this.perguntaSelecionada();
    
    if (!pergunta || !this.validarForm()) {
      alert('Erro na validação!');
      return;
    }

    const atualizada: Pergunta = {
      id: pergunta.id,
      texto: this.texto(),
      alternativas: this.alternativas().filter(a => a.trim() !== ''),
      correta: this.correta(),
      imagem: this.imagem() || null
    };

    const sucesso = await this.adminService.atualizar(pergunta.id!, atualizada);
    if (sucesso) {
      this.irParaLista();
    }
  }

  async deletarPergunta(id: number) {
    if (confirm('Tem certeza que deseja deletar esta pergunta?')) {
      await this.adminService.deletar(id);
    }
  }

  // Helpers
  limparForm() {
    this.texto.set('');
    this.alternativas.set(['', '', '', '']);
    this.correta.set(0);
    this.imagem.set('');
    this.perguntaSelecionada.set(null);
  }

  validarForm(): boolean {
    if (!this.texto() || this.texto().trim().length < 10) return false;
    const altsValidas = this.alternativas().filter(a => a.trim() !== '');
    if (altsValidas.length < 2) return false;
    if (this.correta() < 0 || this.correta() >= altsValidas.length) return false;
    return true;
  }

  atualizarAlternativa(index: number, valor: string) {
    const novasAlts = [...this.alternativas()];
    novasAlts[index] = valor;
    this.alternativas.set(novasAlts);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
