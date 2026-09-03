export interface Perfil {
  idPerfil: number;
  id_perfil?: number;
  nombre: string;
  descripcion?: string;
  estadoRegistro: number;
  estado_registro?: number;
}

export interface Usuario {
  idUsuario: number;
  id_usuario?: number;
  dni: number;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  nombreCompleto?: string;
  celular?: number;
  correoElectronico: string;
  correo?: string;
  usuarioCreacion?: number;
  fechaCreacion?: string;
  usuarioModificacion?: number;
  fechaModificacion?: string;
  estadoRegistro: number;
  estado_registro?: number;
  perfiles?: Perfil[];
  perfiles_ids?: number[];
}

export interface OpcionMenu {
  idOpcionMenu: number;
  id_opcion_menu?: number;
  nombre: string;
  urlMenu: string;
  url_menu?: string;
  descripcion?: string;
  idPadre: number | null;
  id_padre?: number | null;
  padreNombre?: string | null;
  orden?: number;
  estadoRegistro?: number;
  estado_registro?: number;
  hijos?: OpcionMenu[];
}

export interface UsuarioPerfil {
  idUsuario: number;
  idPerfil: number;
  usuarioAsignacion?: number;
  fechaAsignacion?: string;
  usuarioModificacion?: number;
  fechaModificacion?: string;
  estadoRegistro: number;
  perfil?: Perfil;
}

export interface OpcionMenuPerfil {
  idOpcionMenu: number;
  idPerfil: number;
  orden: number;
  estadoRegistro: number;
  opcion?: OpcionMenu;
  perfil?: Perfil;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  usuario: Usuario;
  perfiles: Perfil[];
  mensaje?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  mensaje?: string;
  error?: string;
  total?: number;
  pagina_actual?: number;
  total_paginas?: number;
  data?: T;
}

export type TipoPanel = "tecnico" | "gerencial" | "miembro-equipo" | null;
