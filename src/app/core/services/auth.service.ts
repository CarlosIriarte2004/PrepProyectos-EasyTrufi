import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userKey = 'easytrufi:user';

  constructor(private router: Router) {}

  /** 🔹 Inicia sesión simulada */
  login(email: string) {
    const user = { email, loginAt: new Date().toISOString() };
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.router.navigate(['/dashboard']);
  }

  /** 🔹 Registra un usuario demo y lo redirige al panel */
  registerAndLoginAuto() {
  const demoUser = { email: 'nuevo@easytrufi.bo', createdAt: new Date().toISOString() };
  localStorage.setItem('easytrufi:user', JSON.stringify(demoUser));
  this.router.navigate(['/dashboard']);
}

  /** 🔹 Cierra sesión */
  logout() {
    localStorage.removeItem(this.userKey);
    this.router.navigate(['/login']);
  }

  /** 🔹 Verifica si hay sesión activa */
  isLogged(): boolean {
    return !!localStorage.getItem(this.userKey);
  }

  /** 🔹 Obtiene el usuario actual */
  getCurrentUser() {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }
}
