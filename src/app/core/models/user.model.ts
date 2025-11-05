// src/app/core/models/user.model.ts
export type Beneficio = 'ninguno' | 'estudiantil' | 'tercera_edad' | 'discapacidad';

export interface EasyTrufiUser {
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

export interface UserDTO {
  nombre: string;
  email: string;
  password: string;
  uidTarjeta: string;
  saldo: number;
  beneficio: Beneficio;
  createdAt?: string;
}
