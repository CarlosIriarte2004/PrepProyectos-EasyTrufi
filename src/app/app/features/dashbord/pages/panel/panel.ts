import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// 👇 OJO: 5 niveles arriba porque estás en src/app/app/features/dashbord/pages/panel
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

  // Servicios (tipados)
  private auth: AuthService = inject(AuthService);
  private usersApi: UsersApi = inject(UsersApi);

  // Usuario en sesión
  user: Partial<UserDTO> | null = this.auth.getCurrentUser();

  // Recarga
  recargaMonto: number | null = null;
  loading = false;
  message = '';

  beneficios: Beneficio[] = ['ninguno', 'estudiantil', 'tercera_edad', 'discapacidad'];

  toggleSidebar() { this.sidebarOpen = !this.sidebarOpen; }
  setSection(s: Section) { this.section = s; requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' })); }
  is(s: Section) { return this.section === s; }

  logout() { this.auth.logout(); }

  recargar() {
    this.message = '';
    if (!this.user?.id) { this.message = 'No hay usuario en sesión.'; return; }
    const monto = Number(this.recargaMonto ?? 0);
    if (!(monto > 0)) { this.message = 'Ingresá un monto válido (> 0).'; return; }

    const nuevoSaldo = Number(this.user.saldo ?? 0) + monto;

    this.loading = true;
    this.usersApi.update(this.user.id, { saldo: nuevoSaldo }).subscribe({
      next: (u: UserDTO) => {
        this.user = { ...this.user, ...u };
        this.auth.registerDemo(u); // refresca localStorage
        this.recargaMonto = null;
        this.message = 'Saldo recargado correctamente.';
        this.loading = false;
      },
      error: () => { this.message = 'No se pudo actualizar el saldo.'; this.loading = false; }
    });
  }

  cambiarBeneficio(b: Beneficio) {
    this.message = '';
    if (!this.user?.id) { this.message = 'No hay usuario en sesión.'; return; }

    this.loading = true;
    this.usersApi.update(this.user.id, { beneficio: b }).subscribe({
      next: (u: UserDTO) => {
        this.user = { ...this.user, ...u };
        this.auth.registerDemo(u);
        this.message = 'Beneficio actualizado.';
        this.loading = false;
      },
      error: () => { this.message = 'No se pudo actualizar el beneficio.'; this.loading = false; }
    });
  }
}
