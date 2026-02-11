export const validateRoutine = ({ dia, tablaEjercicios }) => {

    const errors = {}

    const d = Number(dia);

    if (isNaN(d) || d <= 0) {
        errors.dia = "Selecciona un día de la semana";
    }

    if (!Array.isArray(tablaEjercicios) || tablaEjercicios.length == 0) {
        errors.ejercicios = "Agregar al menos un ejercicio a la rutina";
    }

    return errors;

}
