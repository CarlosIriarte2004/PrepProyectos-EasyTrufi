import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface EasyTrufiUser {
  nombre: string;
  email: string;
  password?: string;
  uidTarjeta: string;
  saldo: number;
  beneficio: 'ninguno' | 'estudiantil' | 'tercera_edad' | 'discapacidad';
  createdAt: string;
  loginAt?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userKey = 'easytrufi:user';

  constructor(private router: Router) {}

  /** Inicia sesión simulada por email */
  login(email: string, remember = false) {
    const storage = remember ? localStorage : sessionStorage;
    const current = this.getCurrentUser();

    if (current && current.email === email) {
      current.loginAt = new Date().toISOString();
      storage.setItem(this.userKey, JSON.stringify(current));
    } else {
      const user: EasyTrufiUser = {
        nombre: 'Usuario',
        email,
        uidTarjeta: 'DEMO-UID',
        saldo: 0,
        beneficio: 'ninguno',
        createdAt: new Date().toISOString(),
        loginAt: new Date().toISOString()
      };
      storage.setItem(this.userKey, JSON.stringify(user));
    }
    this.router.navigate(['/dashboard']);
  }

  /** Registro demo completo + autologin */
  registerDemo(payload: any, remember = true) {
    const user: EasyTrufiUser = {
      nombre: payload.nombre,
      email: payload.email,
      password: payload.password,
      uidTarjeta: payload.uidTarjeta,
      saldo: Number(payload.saldo ?? 0),
      beneficio: payload.beneficio,
      createdAt: new Date().toISOString(),
      loginAt: new Date().toISOString()
    };
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(this.userKey, JSON.stringify(user));
    this.router.navigate(['/dashboard']);
  }

  /** Login alternativo por UID de tarjeta */
  loginByCard(uid: string, remember = false): boolean {
    const stored = this.getCurrentUser();
    if (stored && stored.uidTarjeta === uid) {
      stored.loginAt = new Date().toISOString();
      (remember ? localStorage : sessionStorage).setItem(this.userKey, JSON.stringify(stored));
      this.router.navigate(['/dashboard']);
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem(this.userKey);
    sessionStorage.removeItem(this.userKey);
    this.router.navigate(['/login']);
  }

  isLogged(): boolean {
    return !!(localStorage.getItem(this.userKey) ?? sessionStorage.getItem(this.userKey));
  }

  getCurrentUser(): EasyTrufiUser | null {
    const raw = localStorage.getItem(this.userKey) ?? sessionStorage.getItem(this.userKey);
    return raw ? JSON.parse(raw) as EasyTrufiUser : null;
  }
}
