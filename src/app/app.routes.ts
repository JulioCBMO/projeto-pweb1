import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Perguntas } from './perguntas/perguntas';
import { Erro } from './erro/erro';

export const routes: Routes = [
	{ path: '', component: Home },
	{ path: 'perguntas', component: Perguntas },
	{ path: '**', component: Erro },
	
];
