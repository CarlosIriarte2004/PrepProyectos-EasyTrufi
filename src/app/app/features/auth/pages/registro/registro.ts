import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth.service';
import { UsersApi, UserDTO } from '../../../../../core/services/users.api';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistroComponent {
  form: FormGroup;
  private auth = inject(AuthService);
  private usersApi = inject(UsersApi);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      uidTarjeta: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9\-:_]{3,40}$/)]],
      saldo: [0, [Validators.required, Validators.min(0)]],
      beneficio: ['ninguno', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const payload: UserDTO = {
      nombre: this.form.value.nombre,
      email: this.form.value.email,
      password: this.form.value.password,
      uidTarjeta: this.form.value.uidTarjeta,
      saldo: Number(this.form.value.saldo || 0),
      beneficio: this.form.value.beneficio,
      createdAt: new Date().toISOString()
    };

    this.usersApi.create(payload).subscribe({
      next: (user) => {
        // reutilizamos tu flujo: guardar sesión local y navegar
        this.auth.registerDemo(user); // autologin + /dashboard
      },
      error: () => alert('No se pudo registrar en el API. Intentá de nuevo.')
    });
  }
}
