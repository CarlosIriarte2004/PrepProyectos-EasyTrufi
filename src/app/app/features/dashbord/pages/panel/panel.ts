import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../../../core/services/auth.service';
import { UsersApi, UserDTO, Beneficio } from '../../../../../core/services/users.api';

type Section = 'inicio' | 'recargas' | 'puntos' | 'seguridad' | 'ayuda';

@Component({
  selector: 'app-dashboard-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './panel.html',
  styleUrls: ['./panel.css'],
})
export class DashboardPanelComponent {
  // UI
  sidebarOpen = true;
  section: Section = 'inicio';

  // Servicios
  private auth: AuthService = inject(AuthService);
  private usersApi: UsersApi = inject(UsersApi);

  // Sesión reactiva
  user$ = this.auth.currentUser$;
  user = this.auth.getCurrentUser();

  // Recarga
  recargaMonto: number | null = null;
  loading = false;
  message = '';

  beneficios: Beneficio[] = ['ninguno', 'estudiantil', 'tercera_edad', 'discapacidad'];

  ngOnInit() {
    this.auth.bootstrapFromStorage();
    this.user$.subscribe(u => this.user = u);
  }

  toggleSidebar() { this.sidebarOpen = !this.sidebarOpen; }
  setSection(s: Section) { this.section = s; requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' })); }
  is(s: Section) { return this.section === s; }

  logout() { this.auth.logout(); }

  recargar() {
    this.message = '';
    const u = this.user;
    if (!u?.id) { this.message = 'No hay usuario en sesión.'; return; }

    const monto = Number(this.recargaMonto ?? 0);
    if (!(monto > 0)) { this.message = 'Ingresá un monto válido (> 0).'; return; }

    const nuevoSaldo = Number(u.saldo ?? 0) + Math.ceil(monto);
    this.loading = true;

    this.usersApi.updateSafe(u.id, { saldo: nuevoSaldo }).subscribe({
      next: (updated: UserDTO) => {
        this.auth.setUser({ ...updated, loginAt: new Date().toISOString() });
        this.recargaMonto = null;
        this.message = 'Saldo recargado correctamente.';
      },
      error: () => { this.message = 'No se pudo actualizar el saldo.'; },
      complete: () => { this.loading = false; }
    });
  }

  // ✅ BENEFICIO corregido
  cambiarBeneficio(b: Beneficio) {
    this.message = '';
    const u = this.user;
    if (!u?.id) { this.message = 'No hay usuario en sesión.'; return; }
    if (u.beneficio === b) { this.message = 'Ya tenés este beneficio.'; return; }

    this.loading = true;

    // 🔸 Optimistic UI: reflejar el cambio al instante
    const beneficioAnterior = u.beneficio;
    this.auth.updateUserInStore({ beneficio: b });

    // 🔸 Guardar en MockAPI (GET→PUT)
    this.usersApi.updateSafe(u.id, { beneficio: b }).subscribe({
      next: (updated: UserDTO) => {
        this.auth.setUser({ ...updated, loginAt: new Date().toISOString() });
        this.message = `Beneficio actualizado a "${b}".`;
      },
      error: () => {
        // Revertir si hay error
        this.auth.updateUserInStore({ beneficio: beneficioAnterior });
        this.message = 'No se pudo actualizar el beneficio.';
      },
      complete: () => { this.loading = false; }
    });
  }
}
