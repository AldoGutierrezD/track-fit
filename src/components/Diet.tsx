import { useEffect, useState } from "react";
import ItemFood from "./ItemFood";
import { supabase } from "@/lib/supabase";
import { DietaPlatillo } from "@/types/interfaces";
import { Info } from "lucide-react";
import Swal from "sweetalert2";
import FullScreenLoader from "./LoadingOverlay";


export default function Diet() {

    const COLORS = ["bg-pink-300", "bg-lime-200", "bg-amber-200", "bg-blue-200", "bg-purple-200", "bg-emerald-100"];
    const [observaciones, setObservaciones] = useState("");
    const [ultimaActualizacion, setUltimaActualizacion] = useState("");
    const [dietaPlatillos, setDietaPlatillos] = useState<DietaPlatillo[]>([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        getDieta();
        getDietaComidas();
    }, []);


    const getDieta = async () => {

        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error } = await supabase.rpc(
            "get_dieta",
            { id_usuariod: user.id }
        );

        if (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error al cargar los datos de la dieta"
            });
            return
        }

        setObservaciones(data[0].observaciones);
        setUltimaActualizacion(data[0].updated_at);

        setLoading(false);

    }


    const getDietaComidas = async () => {

        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error } = await supabase.rpc(
            "get_dieta_completa",
            { id_usuariod: user.id }
        );

        if (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error al cargar las comidas de la dieta"
            });
            return
        }

        setDietaPlatillos(data);

        setLoading(false);

    }

    return (
        <div className="w-full">
            <FullScreenLoader loading={loading} />
            <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-3">
                {
                    dietaPlatillos.map((item, index) => (
                        <ItemFood
                            key={item.id}
                            color={COLORS[index]}
                            hour={item.horario}
                            name={item.nombre}
                            carbs={item.carbohidratos}
                            protein={item.proteina}
                            fat={item.grasas}
                            ingredients={item.ingredientes}
                        />
                    ))
                }
            </div>
            <div className="w-full mt-4 border-3 border-amber-500 rounded-2xl p-2 flex gap-2 bg-amber-100">
                <Info size={62} className="text-amber-500" />
                <p>{observaciones}</p>
            </div>
            <div className="text-right mt-2">
                <span className="italic font-light text-sm text-[#959595]">Ultima módificacion {ultimaActualizacion.split(" ")[0]}</span>
            </div>
        </div>
    )
}
