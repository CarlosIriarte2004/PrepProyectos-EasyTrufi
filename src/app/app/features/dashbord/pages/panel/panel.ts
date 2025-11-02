import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type Section = 'inicio' | 'recargas' | 'puntos' | 'seguridad' | 'ayuda';

@Component({
  selector: 'app-dashboard-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel.html',
  styleUrls: ['./panel.css'],
})
export class DashboardPanelComponent {
  sidebarOpen = true;
  section: Section = 'inicio';

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  setSection(s: Section) {
    this.section = s;
    requestAnimationFrame(() =>
      window.scrollTo({ top: 0, behavior: 'smooth' })
    );
  }

  is(s: Section) {
    return this.section === s;
  }
}
