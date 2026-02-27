import { useState, useEffect, useMemo } from "react"
import { supabase } from "@/lib/supabase"
import ItemGymRoutine from "./ItemGymRoutine"
import { Dumbbell } from "lucide-react"
import Swal from "sweetalert2"
import FullScreenLoader from "./LoadingOverlay"
import { RutinaEjercicio } from "@/types/interfaces"

export default function GymRoutine() {

    const [ultimaActualizacion, setUltimaActualizacion] = useState("");
    const [ejercicios, setEjercicios] = useState<RutinaEjercicio[]>([]);
    const [loading, setLoading] = useState(false);

    const today = new Date();
    const dayNumber = today.getDay();

    useEffect(() => {
        getRutina();
    }, []);

    const musculos = useMemo(() => {
        return Array.from(
            new Set(ejercicios.map(e => e.musculo))
        );
    }, [ejercicios]);


    const getRutina = async () => {

        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error } = await supabase.rpc(
            "get_rutina_gym",
            {
                id_usuariod: user.id,
                diad: dayNumber
            }
        );

        if (error || !data) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error al cargar la rutina de hoy"
            });
            return
        }

        if (data.length <= 0) return

        setUltimaActualizacion(data[0].created_at);

        const { data: dataEjercicios, error: errorEjercicios } = await supabase.rpc(
            "get_rutina_gym_ejercicios",
            { idd: data[0].id }
        );

        if (errorEjercicios || !dataEjercicios) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error al cargar los ejercicios de hoy"
            });
            return
        }

        setEjercicios(dataEjercicios || []);

    }

    if (ejercicios.length <= 0) return null;

    return (
        <div className="w-full grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-2">
            <div className="col-span-full lg:col-span-2 xl:col-span-1">
                <img src="./images/chest-day.png" className="w-full h-auto rounded-2xl" alt="" />
                <span className="flex items-center gap-2 mt-4 mb-2">
                    <Dumbbell size={24} />
                    <h6 className="font-inter font-semibold">{musculos.join(", ")}</h6>
                </span>
                <span className="italic font-light text-sm text-[#959595]">Ultima módificacion {ultimaActualizacion.split("T")[0]}</span>
            </div>
            <div className="col-span-full lg:col-span-2 xl:col-span-2 grid grid-cols-2 gap-3">
                {
                    ejercicios.map((element, index) => (
                        <ItemGymRoutine
                            key={index}
                            image=""
                            exercise={element.nombre}
                            description={element.indicaciones}
                            sets={element.series}
                            reps={element.reps}
                        />
                    ))
                }
            </div>
        </div>
    )
}
