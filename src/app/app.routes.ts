import { Routes } from '@angular/router';
import { Home } from './home/home';
import { PerguntasComponent } from './perguntas/perguntas';
import { ResultadoComponent } from './resultado/resultado';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'perguntas', component: PerguntasComponent },
  { path: 'resultado', component: ResultadoComponent },
  { path: '**', redirectTo: '' }
];
