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
