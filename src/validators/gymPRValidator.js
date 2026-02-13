export const validateGymPR = ({ fecha, ejercicio, series, reps, peso }) => {

    const errors = {}

    const date = String(fecha);
    const exercise = Number(ejercicio);
    const sets = Number(series);
    const rep = Number(reps);
    const weight = Number(peso);

    if (!date) {
        errors.fecha = "Indica la fecha";
    }

    if (isNaN(exercise) || exercise <= 0) {
        errors.ejercicio = "Selecciona un ejercicio";
    }

    if (isNaN(sets) || sets <= 0) {
        errors.series = "Indica el número de series";
    }

    if (isNaN(rep) || rep <= 0) {
        errors.reps = "Indica el número de repeticiones";
    }

    if (isNaN(weight) || weight <= 0) {
        errors.peso = "Indica el peso levantado";
    }

    return errors;

}
