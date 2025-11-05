import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  Validators,
  FormGroup,
  FormControl
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth.service';
import { UsersApi } from '../../../../../core/services/users.api';

type LoginForm = FormGroup<{
  email: FormControl<string>;
  password: FormControl<string>;
  remember: FormControl<boolean>;
}>;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  // -------- estado para login por email ----------
  form: LoginForm = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
    remember: new FormControl(false, { nonNullable: true })
  });

  // -------- estado para login por tarjeta ----------
  useCard = false; 
  uidForm = new FormGroup({
    uidTarjeta: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  hide = true;
  loading = false;
  errorMsg = '';

  constructor(private auth: AuthService, private usersApi: UsersApi) {}

  get f(): LoginForm['controls'] { return this.form.controls; }

  // -------- submit por email/password ----------
  onSubmit() {
    this.errorMsg = '';
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.loading = true;
    const { email, password, remember } = this.form.getRawValue();

    this.usersApi.findByEmailAndPassword(email!, password!).subscribe({
      next: (rows) => {
        this.loading = false;
        if (!rows.length) { this.errorMsg = 'Credenciales inválidas.'; return; }
        const user = rows[0];
        this.auth.registerDemo(user, !!remember); // guarda sesión local y navega a /dashboard
      },
      error: () => { this.loading = false; this.errorMsg = 'Error de conexión con el API.'; }
    });
  }

  // -------- submit por UID de tarjeta ----------
  onSubmitCard() {
    this.errorMsg = '';
    this.uidForm.markAllAsTouched();
    if (this.uidForm.invalid) return;

    this.loading = true;
    const { uidTarjeta } = this.uidForm.getRawValue();

    this.usersApi.findByUID(uidTarjeta!).subscribe({
      next: (rows) => {
        this.loading = false;
        if (!rows.length) { this.errorMsg = 'UID no reconocido.'; return; }
        const user = rows[0];
        this.auth.registerDemo(user, false);
      },
      error: () => { this.loading = false; this.errorMsg = 'Error de conexión con el API.'; }
    });
  }

  togglePassword() { this.hide = !this.hide; }
}
