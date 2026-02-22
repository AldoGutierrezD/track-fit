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

export interface EjercicioGymPR {
    icon: string,
    nombre: string,
    fecha: string,
    series: number,
    reps: number,
    peso: number,
    peso_anterior: number
}

export interface UnidadIngrediente {
    id: number,
    nombre: string
}

export interface Ingrediente {
    id: number,
    id_categoria_ingrediente: number,
    nombre: string,
    kcal: number,
    proteina: number,
    carbohidratos: number,
    grasas: number,
    gramos_por_unidad: number
}

export interface IngredienteOption extends Ingrediente {
    value: number,
    label: string
}

export interface Platillo {
    id: string,
    nombre: string,
    kcal_totales: number,
    proteina: number,
    carbohidratos: number,
    grasas: number
}

export interface PlatilloIngrediente {
    id: number,
    nombre: string,
    cantidad: number,
    id_unidad: number,
    gramos_calculados: number,
    kcal: number,
    proteina: number,
    carbohidratos: number,
    grasas: number,
    gramos_por_unidad: number,
    kcalTotales: number,
    proteinasTotales: number,
    carbohidratosTotales: number,
    grasasTotales: number
}

export interface Dieta {
    id: string,
    nombre: string,
    hora: string,
    kcalTotales: number,
    proteinasTotales: number,
    carbohidratosTotales: number,
    grasasTotales: number
}

export interface DietaPlatillo {
    id: string,
    horario: string,
    nombre: string,
    descripcion: string,
    kcal_totales: number,
    proteina: number,
    carbohidratos: number,
    grasas: number,
    ingredientes: DietaPlatilloIngrediente[]
}

export interface DietaPlatilloIngrediente {
    nombre: string,
    cantidad: number,
    unidad: string
}
