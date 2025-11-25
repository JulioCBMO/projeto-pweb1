import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { PerguntasComponent } from './perguntas/perguntas';
import { ResultadoComponent } from './resultado/resultado';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'perguntas', component: PerguntasComponent },
  { path: 'resultado', component: ResultadoComponent },
  { path: '**', redirectTo: '' }
];
