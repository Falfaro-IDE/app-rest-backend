export class ClienteClass {
  id?: number = 0;
  estado?: number = 0;
  persona: {
    ruc_dni: string;
    nombre: string;
    email: string;
    direccion?: string;
    img: string;
    estado?: number;
    documentos: {
      id: number;
      documento: string;
      estado: number;
      numero?: string;
    }[];
  } = {
    ruc_dni: '',
    nombre: '',
    email: '',
    direccion: '',
    img: '',
    estado : 0,
    documentos: []
  };
  empresa_id?: number = 0;
  documentos: {
    id: number;
    documento: string;
    estado: number;
  }[] = [];
}
