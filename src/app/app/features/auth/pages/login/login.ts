import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators, FormGroup, FormControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth.service';

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
  form: LoginForm;
  uidForm = new FormGroup({
    uidTarjeta: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });
  hide = true;
  loading = false;
  useCard = false;
  errorMsg = '';

  constructor(private auth: AuthService) {
    this.form = new FormGroup({
      email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
      password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
      remember: new FormControl(false, { nonNullable: true })
    });
  }

  get f(): LoginForm['controls'] { return this.form.controls; }

  async onSubmit() {
    this.errorMsg = '';
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.loading = true;
    try {
      const { email, remember } = this.form.getRawValue();
      await new Promise(r => setTimeout(r, 300)); // demo delay
      this.auth.login(email, remember);
    } finally {
      this.loading = false;
    }
  }

  async onSubmitCard() {
    this.errorMsg = '';
    this.uidForm.markAllAsTouched();
    if (this.uidForm.invalid) return;

    this.loading = true;
    try {
      const { uidTarjeta } = this.uidForm.getRawValue();
      await new Promise(r => setTimeout(r, 300)); // demo delay
      const ok = this.auth.loginByCard(uidTarjeta!);
      if (!ok) this.errorMsg = 'UID no reconocido. Registrá tu tarjeta primero.';
    } finally {
      this.loading = false;
    }
  }

  togglePassword() { this.hide = !this.hide; }
}
