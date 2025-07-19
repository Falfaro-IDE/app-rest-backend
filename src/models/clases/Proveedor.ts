export class ProveedorDto {
  id!: number;
  nombre!: string;
  ruc!: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  estado!: number;
  fecha_creacion?: string;
  hora_creacion?: string;

  constructor(init?: Partial<ProveedorDto>) {
    this.nombre = "";
    this.ruc = "";
    this.estado = 0;
    Object.assign(this, init);
  }
}
