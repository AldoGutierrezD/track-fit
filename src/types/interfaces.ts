export interface Medicion {
    id: string,
    nombre: string,
    unidad: string
}

export interface SesionMedicionRow {
    fecha: string;
    medicion: string;
    valor: number;
    unidad: string;
}

export interface Objetivo {
    id: string,
    medicion: string,
    descripcion: string,
    valor: number,
    fecha: string,
    estado: number
}
