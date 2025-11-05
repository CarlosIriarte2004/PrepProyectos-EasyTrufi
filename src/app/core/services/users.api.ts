import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, switchMap, map } from 'rxjs';

export type Beneficio = 'ninguno' | 'estudiantil' | 'tercera_edad' | 'discapacidad';

export interface UserDTO {
  id: string;             
  nombre: string;
  email: string;
  password?: string;
  uidTarjeta: string;
  saldo: number;
  beneficio: Beneficio;
  createdAt: string;
  loginAt?: string;
}

@Injectable({ providedIn: 'root' })
export class UsersApi {
  private base = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  create(user: Omit<UserDTO, 'id'>): Observable<UserDTO> {
    return this.http.post<UserDTO>(this.base, user);
  }

  getById(id: string): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.base}/${id}`);
  }

  getAll(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(this.base);
  }

  findByEmailAndPassword(email: string, password: string): Observable<UserDTO[]> {
    const params = new HttpParams().set('email', email).set('password', password);
    return this.http.get<UserDTO[]>(this.base, { params });
  }

  findByUID(uid: string): Observable<UserDTO[]> {
    const params = new HttpParams().set('uidTarjeta', uid);
    return this.http.get<UserDTO[]>(this.base, { params });
  }

  updateSafe(id: string, patch: Partial<UserDTO>): Observable<UserDTO> {
    return this.getById(id).pipe(
      map(current => ({ ...current, ...patch } as UserDTO)),
      switchMap(merged => this.http.put<UserDTO>(`${this.base}/${id}`, merged))
    );
  }
}
