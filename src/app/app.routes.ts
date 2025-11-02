// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard'; // ✅ importa el guard

export const routes: Routes = [
  // Landing (inicio)
  {
    path: '',
    loadComponent: () =>
      import('./app/features/home/pages/inicio/inicio')
        .then(m => m.InicioComponent)
  },

  // Login
  {
    path: 'login',
    loadComponent: () =>
      import('./app/features/auth/pages/login/login')
        .then(m => m.LoginComponent)
  },

  // Registro (crea cuenta demo y redirige a dashboard)
  {
    path: 'registro',
    loadComponent: () =>
      import('./app/features/auth/pages/registro/registro')
        .then(m => m.RegistroComponent)
  },

  // Dashboard (protegido)
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./app/features/dashbord/pages/panel/panel') // tu carpeta es "dashbord"
        .then(m => m.DashboardPanelComponent),
    canActivate: [authGuard] // ✅ protege esta ruta
  },

  // Cualquier otra ruta → inicio
  { path: '**', redirectTo: '' }
];
