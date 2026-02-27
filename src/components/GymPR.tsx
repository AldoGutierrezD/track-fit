import ItemGymPR from "./ItemGymPR"
import { EjercicioGymPR } from "@/types/interfaces";

type Props = {
    ejercicios: EjercicioGymPR[]
}

export default function GymPR({ ejercicios }: Props) {

    return (
        <div className="w-full grid grid-cols-6 lg:grid-cols-4 xl:grid-cols-8 gap-3">
            {
                ejercicios.map((item, index) => {
                    let pr = (!item.peso_anterior || item.peso_anterior <= 0) ? 0 : (item.peso - item.peso_anterior);
                    return (
                        <ItemGymPR key={index} image={item.icon} exercise={item.nombre} weight={item.peso} reps={item.reps} date={item.fecha} pr={pr} />
                    )
                })
            }
        </div>
    )
}
