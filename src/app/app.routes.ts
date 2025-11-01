import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./app/features/home/pages/inicio/inicio')
        .then(({ InicioComponent }) => InicioComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./app/features/auth/pages/login/login')
        .then(({ LoginComponent }) => LoginComponent)
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./app/features/auth/pages/registro/registro')
        .then(({ RegistroComponent }) => RegistroComponent)
  },
  { path: '**', redirectTo: '' }
];
