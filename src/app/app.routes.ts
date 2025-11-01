import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./app/features/home/pages/inicio/inicio')
        .then(m => m.InicioComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./app/features/auth/pages/login/login')
        .then(m => m.LoginComponent)
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./app/features/auth/pages/registro/registro')
        .then(m => m.RegistroComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./app/features/dashbord/pages/panel/panel')   // <— OJO: dashbord
        .then(m => m.DashboardPanelComponent)
  },
  { path: '**', redirectTo: '' }
];
