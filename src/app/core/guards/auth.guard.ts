import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// ✅ Este archivo debe exportar el guard como constante
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLogged()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
