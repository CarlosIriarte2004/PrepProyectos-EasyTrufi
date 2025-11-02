import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators, FormGroup, FormControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth.service'; // ajustá el path si difiere

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
  hide = true;
  loading = false;

  constructor(private auth: AuthService) {
    this.form = new FormGroup({
      email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
      password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
      remember: new FormControl(false, { nonNullable: true })
    });
  }

  get f(): LoginForm['controls'] { return this.form.controls; }

  async onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.loading = true;
    try {
      // ⚠️ Mantengo la simulación, pero ahora usando el servicio y “remember”
      const { email, remember } = this.form.getRawValue();
      await new Promise(r => setTimeout(r, 400)); // demo delay
      this.auth.login(email, remember); // ⬅️ ahora pasa el modo de almacenamiento
    } finally {
      this.loading = false;
    }
  }

  togglePassword() { this.hide = !this.hide; }
}
