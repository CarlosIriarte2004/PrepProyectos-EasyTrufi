import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export type Beneficio = 'ninguno' | 'estudiantil' | 'tercera_edad' | 'discapacidad';

export interface UserDTO {
  id?: string;
  nombre: string;
  email: string;
  password: string;
  uidTarjeta: string;
  saldo: number;
  beneficio: Beneficio;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class UsersApi {
  private base = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  create(user: UserDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(this.base, user);
  }

  findByEmailAndPassword(email: string, password: string): Observable<UserDTO[]> {
    const params = new HttpParams().set('email', email).set('password', password);
    return this.http.get<UserDTO[]>(this.base, { params });
  }

  findByUID(uid: string): Observable<UserDTO[]> {
    const params = new HttpParams().set('uidTarjeta', uid);
    return this.http.get<UserDTO[]>(this.base, { params });
  }

  update(id: string, patch: Partial<UserDTO>): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.base}/${id}`, patch);
  }

  getAll(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(this.base);
  }
}
