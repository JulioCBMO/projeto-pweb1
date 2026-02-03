import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Erro } from './erro/erro';
import { PerguntasComponent } from './perguntas/perguntas';
import { ResultadoComponent } from './resultado/resultado';
import { AdminComponent } from './admin/admin.components';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'perguntas', component: PerguntasComponent },
  { path: 'resultado', component: ResultadoComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'erro', component: Erro },
  { path: '**', redirectTo: 'erro' }
];
