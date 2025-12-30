export const validateMacros = ({ carbohidratos, proteinas, grasas }) => {

    const errors = {}

    const c = Number(carbohidratos);
    const p = Number(proteinas);
    const g = Number(grasas);

    if (isNaN(c) || c < 0) {
        errors.carbohidratos = "Carbohidratos inválidos";
    }

    if (isNaN(p) || p < 0) {
        errors.proteinas = "Proteínas inválidas";
    }

    if (isNaN(g) || g < 0) {
        errors.grasas = "Grasas inválidas";
    }

    const kcal = (c * 4) + (p * 4) + (g * 9);

    if (kcal == 0) {
        errors.kcal = "Las kcal son incorrectas";
    }

    return errors

}
