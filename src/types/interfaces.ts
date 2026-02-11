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

export interface EjercicioGym {
    id: number,
    id_categoria_musculo: number,
    nombre: string,
    icon: string
}

export interface EjercicioGymOptions {
    value: number,
    label: string,
    icon: string,
    series: number | "",
    reps: number | "",
    indicaciones: string
}

export interface Rutina {
    id: string,
    dia: string,
    ejercicios: RutinaEjercicio[]
}

export interface RutinaEjercicio {
    nombre: string,
    musculo: string,
    icon: string,
    series: number,
    reps: number,
    indicaciones: string
}
