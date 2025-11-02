import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Este guard bloquea el acceso a rutas protegidas (por ejemplo dashboard)
 * si el usuario no está logueado.
 */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLogged()) {
    return true;
  }

  // Si no hay sesión, redirige al login
  router.navigate(['/login']);
  return false;
};
