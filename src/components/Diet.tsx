import { useEffect, useState } from "react";
import ItemFood from "./ItemFood";
import { supabase } from "@/lib/supabase";
import { DietaPlatillo } from "@/types/interfaces";
import Swal from "sweetalert2";
import FullScreenLoader from "./LoadingOverlay";


export default function Diet() {

    const COLORS = ["bg-pink-300", "bg-lime-200", "bg-amber-200", "bg-blue-200", "bg-purple-200"];
    const [dietaPlatillos, setDietaPlatillos] = useState<DietaPlatillo[]>([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        getDieta();
    }, []);


    const getDieta = async () => {

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
                text: "Error al cargar los datos de la dieta"
            });
            return
        }

        setDietaPlatillos(data);

        setLoading(false);

    }

    return (
        <div className="grid grid-cols-3 gap-3">
            <FullScreenLoader loading={loading} />
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
    )
}
