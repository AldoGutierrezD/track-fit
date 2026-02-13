import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import FullScreenLoader from "./LoadingOverlay";

export default function Objetivo() {

    const [valorActual, setValorActual] = useState(0);
    const [valorObjetivo, setValorObjetivo] = useState(0);
    const [unidad, setUnidad] = useState("");
    const [nombreUnidad, setNombreUnidad] = useState("");
    const [objetivo, setObjetivo] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getValores();
    }, []);

    const getValores = async () => {

        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error } = await supabase.rpc(
            "get_objetivo_actual",
            { id_usuariod: user.id }
        );

        if (!error) {
            setValorObjetivo(Number(data[0].valor_objetivo));
            setValorActual(Number(data[0].valor_actual));
            setUnidad((data[0].unidad).toUpperCase());
            setNombreUnidad(data[0].nombre_unidad);
            setObjetivo(data[0].objetivo);
        }

        setLoading(false);

    }

    const porcentajeAvance = useMemo(() => {
        if (!valorActual) return 0;
        return Number(((valorActual * 100) / valorObjetivo).toFixed(1));
    }, [valorActual]);

    return (
        <div className="h-[90%] border-3 relative rounded-2xl flex justify-center items-center bg-gradient-to-t from-amber-50 to-amber-200 shadow-[0px_5px_0px_0px_#000000]">
            <FullScreenLoader loading={loading} />
            <span className='badge badge-info absolute bottom-3 left-1/2 -translate-x-1/2'>{objetivo}</span>
            <div className="relative size-50 bottom-4">
                <svg className="rotate-[135deg] size-full" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-green-200 dark:text-green-200" stroke-width="1" stroke-dasharray="100 100" stroke-linecap="round"></circle>

                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-green-400 green-400:text-dark" stroke-width="2" stroke-dasharray={`${porcentajeAvance} 100`} stroke-linecap="round"></circle>
                </svg>

                <div className="absolute top-1/2 start-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <span className="font-against text-5xl font-bold text-black dark:text-black">{porcentajeAvance}%</span>
                    <span className="font-inter font-light text-black dark:text-black block">{valorActual.toFixed(1)}{unidad} / {valorObjetivo.toFixed(1)}{unidad}</span>
                </div>
            </div>
        </div>
    )
}
