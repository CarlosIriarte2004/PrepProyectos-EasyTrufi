import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  Validators,
  FormGroup,
  FormControl
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

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

  constructor(private router: Router) {
    this.form = new FormGroup({
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)]
      }),
      remember: new FormControl(false, { nonNullable: true })
    });
  }

  // Autocompletado fuerte en el template
  get f(): LoginForm['controls'] {
    return this.form.controls;
  }

  async onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.loading = true;
    try {
      // Simulación; acá luego va la llamada real a Sanity/Backend
      await new Promise(r => setTimeout(r, 600));
      localStorage.setItem('et_logged', '1');

      // ⬇️ Redirige al panel principal del negocio
      this.router.navigateByUrl('/dashboard');
    } finally {
      this.loading = false;
    }
  }

  togglePassword() { this.hide = !this.hide; }
}

