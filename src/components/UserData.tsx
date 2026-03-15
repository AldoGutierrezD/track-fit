import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase"
import FullScreenLoader from "./LoadingOverlay";

export default function RightBar() {

    const { user, loading } = useAuth();
    const [nombre, setNombre] = useState("");
    const [edad, setEdad] = useState("");
    const [estatura, setEstatura] = useState("");
    const [peso, setPeso] = useState("");
    const [diaProximaSesion, setDiaProximaSesion] = useState("");
    const [mesProximaSesion, setMesProximaSesion] = useState("");
    const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    useEffect(() => {
        if (!user) return;
        obtenerDatos(user.id);
        getUltimaSesion(user.id);
    }, [user]);


    const obtenerDatos = async (userId: string) => {

        const { data, error } = await supabase.rpc(
            "get_usuario",
            { idd: userId }
        );

        if (!error) {
            setNombre(data[0].nombre);
            setEdad(data[0].edad);
            setEstatura(data[0].estatura);
            setPeso(data[0].peso);
        }

    }


    const getUltimaSesion = async (userId: string) => {

        const { data, error } = await supabase.rpc(
            "get_sesion_ultima",
            { id_usuariod: userId }
        );

        if (!error) {
            let fechaProximaSesion = new Date(data[0].fecha + "T00:00:00");
            fechaProximaSesion.setDate(fechaProximaSesion.getDate() + 30);
            let fechaFormateada = fechaProximaSesion.toISOString().split('T')[0];
            let month = MESES[Number(fechaFormateada.split("-")[1]) - 1];
            let day = fechaFormateada.split("-")[2];
            setDiaProximaSesion(day);
            setMesProximaSesion(month);
        }

    }


    return (
        <div>
            <FullScreenLoader loading={loading} />
            <div className="w-full h-auto bg-green-300 rounded-2xl p-5 border-3">

                <div className="w-full h-80">
                    <img src="/images/right-cover.webp" alt="" className="w-full h-full object-cover border-3 rounded-xl" />
                </div>

                <div className="w-full border-3 bg-amber-50 p-2 mt-4">
                    <h3 className="font-against font-bold text-lg text-center">{nombre}</h3>
                    <div className="flex justify-between mt-2">
                        <span className="font-brule font-light text-sm">{edad} años</span>
                        <span className="font-brule font-light text-sm">{peso}kg</span>
                        <span className="font-brule font-light text-sm">{estatura}cm</span>
                    </div>
                </div>

                <div className="w-full border-t-2 border-dotted mt-4"></div>

                <div className="flex justify-between">
                    <div className="w-1/4 border-t-2 border-dotted mt-4"></div>
                    <div className="w-1/4 border-t-2 border-dotted mt-4"></div>
                </div>

                <div className="w-full text-center">
                    <span className="font-brule">ä</span>
                </div>

            </div>

            <div className="w-full h-auto border-3 bg-amber-200 p-2 mt-4 flex gap-2 rounded-2xl">
                <div className="w-36 h-20 bg-amber-50 border-3 flex flex-col items-center rounded-xl">
                    <span className="font-brule font-bold text-4xl">{diaProximaSesion}</span>
                    <span className="font-brule">{mesProximaSesion}</span>
                </div>
                <div>
                    <span className="font-bold italic">Próxima revisión</span>
                    <p className="text-xs">Recuerda que tu siguiente revisión es cerca del {diaProximaSesion} de {mesProximaSesion}</p>
                </div>
            </div>
        </div>
    )
}
