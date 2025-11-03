import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('easytrufi:token');
  const cloned = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(cloned).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 0) {
        return throwError(() => new Error('No puedo conectar con el API. ¿Está el mock activo en el puerto correcto?'));
      }
      if (err.status === 401) {
        return throwError(() => new Error('Sesión expirada o credenciales inválidas.'));
      }
      return throwError(() => err);
    })
  );
};
