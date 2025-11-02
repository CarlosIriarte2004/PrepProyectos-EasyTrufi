import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth.service';

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

  beneficios = ['ninguno','estudiantil','tercera_edad','discapacidad'] as const;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      uidTarjeta: ['', [
        Validators.required,
        Validators.pattern(/^[A-Za-z0-9\-:_]{6,32}$/) // 6–32, alfanum y -:_
      ]],
      saldo: [0, [Validators.required, Validators.min(0)]],
      beneficio: ['ninguno', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // Guarda el usuario demo completo y redirige
    this.auth.registerDemo(this.form.value);
  }
}
