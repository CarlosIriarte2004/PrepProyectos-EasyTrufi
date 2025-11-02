import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userKey = 'easytrufi:user';

  constructor(private router: Router) {}

  /** Inicia sesión simulada */
  login(email: string, remember = false) {
    const user = { email, loginAt: new Date().toISOString() };
    const storage = remember ? localStorage : sessionStorage; // ⬅️ respeta “recordarme”
    storage.setItem(this.userKey, JSON.stringify(user));
    this.router.navigate(['/dashboard']);
  }

  /** Registra un usuario demo y lo redirige al panel */
  registerAndLoginAuto(remember = true) {
    const demoUser = { email: 'nuevo@easytrufi.bo', createdAt: new Date().toISOString() };
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(this.userKey, JSON.stringify(demoUser));
    this.router.navigate(['/dashboard']);
  }

  /** Cierra sesión en ambos lugares */
  logout() {
    localStorage.removeItem(this.userKey);
    sessionStorage.removeItem(this.userKey);
    this.router.navigate(['/login']);
  }

  /** Verifica si hay sesión activa en localStorage o sessionStorage */
  isLogged(): boolean {
    return !!(localStorage.getItem(this.userKey) ?? sessionStorage.getItem(this.userKey));
  }

  /** Obtiene el usuario actual desde el storage disponible */
  getCurrentUser() {
    const raw = localStorage.getItem(this.userKey) ?? sessionStorage.getItem(this.userKey);
    return raw ? JSON.parse(raw) : null;
  }
}
