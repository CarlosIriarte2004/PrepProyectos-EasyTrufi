import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

export type Beneficio = 'ninguno' | 'estudiantil' | 'tercera_edad' | 'discapacidad';

export interface EasyTrufiUser {
  id: string;                 // <- NECESARIO para actualizar en MockAPI
  nombre: string;
  email: string;
  password?: string;
  uidTarjeta: string;
  saldo: number;
  beneficio: Beneficio;
  createdAt: string;
  loginAt?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userKey = 'easytrufi:user';

  private _user$ = new BehaviorSubject<EasyTrufiUser | null>(null);
  public currentUser$ = this._user$.asObservable();

  constructor(private router: Router) {}

  getCurrentUser(): EasyTrufiUser | null {
    return this._user$.value ?? this.readFromAnyStorage();
  }

  bootstrapFromStorage(): void {
    const u = this.readFromAnyStorage();
    this._user$.next(u);
  }

  setUser(user: EasyTrufiUser, remember = true): void {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(this.userKey, JSON.stringify(user));
    (remember ? sessionStorage : localStorage).removeItem(this.userKey);
    this._user$.next(user);
  }

  updateUserInStore(patch: Partial<EasyTrufiUser>): void {
    const current = this.getCurrentUser();
    if (!current) return;
    const updated = { ...current, ...patch };
    this.setUser(updated, !!localStorage.getItem(this.userKey));
  }

  /** Usar con el DTO real que devuelve MockAPI (incluye id:string) */
  registerDemo(payload: any, remember = true): void {
    const user: EasyTrufiUser = {
      id: String(payload.id),
      nombre: payload.nombre ?? 'Usuario',
      email: payload.email,
      password: payload.password,
      uidTarjeta: payload.uidTarjeta ?? 'DEMO-UID',
      saldo: Number(payload.saldo ?? 0),
      beneficio: (payload.beneficio ?? 'ninguno'),
      createdAt: payload.createdAt ?? new Date().toISOString(),
      loginAt: new Date().toISOString(),
    };
    this.setUser(user, remember);
    this.router.navigate(['/dashboard']);
  }

  login(email: string, remember = false) {
    const current = this.readFromAnyStorage();
    if (current && current.email === email) {
      current.loginAt = new Date().toISOString();
      this.setUser(current, remember);
      this.router.navigate(['/dashboard']);
      return;
    }
    // “dummy” local si no consultás MockAPI en login:
    const dummy: EasyTrufiUser = {
      id: 'local-demo',
      nombre: 'Usuario',
      email,
      uidTarjeta: 'DEMO-UID',
      saldo: 0,
      beneficio: 'ninguno',
      createdAt: new Date().toISOString(),
      loginAt: new Date().toISOString(),
    };
    this.setUser(dummy, remember);
    this.router.navigate(['/dashboard']);
  }

  loginByCard(uid: string, remember = false): boolean {
    const stored = this.readFromAnyStorage();
    if (stored && stored.uidTarjeta === uid) {
      stored.loginAt = new Date().toISOString();
      this.setUser(stored, remember);
      this.router.navigate(['/dashboard']);
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem(this.userKey);
    sessionStorage.removeItem(this.userKey);
    this._user$.next(null);
    this.router.navigate(['/login']);
  }

  isLogged(): boolean {
    return !!(localStorage.getItem(this.userKey) ?? sessionStorage.getItem(this.userKey));
  }

  private readFromAnyStorage(): EasyTrufiUser | null {
    const raw = localStorage.getItem(this.userKey) ?? sessionStorage.getItem(this.userKey);
    try { return raw ? JSON.parse(raw) as EasyTrufiUser : null; } catch { return null; }
  }
}
