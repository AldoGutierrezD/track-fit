import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import FullScreenLoader from "./LoadingOverlay";

export default function MacrosDia() {

    const [carbohidratos, setCarbohidratos] = useState(0);
    const [proteinas, setProteinas] = useState(0);
    const [grasas, setGrasas] = useState(0);
    const [kcal, setKcal] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getMacros();
    }, []);

    const getMacros = async () => {

        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error } = await supabase.rpc(
            "get_usuario_macros",
            { id_usuariod: user.id }
        )

        if (error || !data) {
            setCarbohidratos(0);
            setProteinas(0);
            setGrasas(0);
            setKcal(0);
            return
        }

        console.log(data)

        let perCarbohidratos = data[0].carbohidratos ? (Number(data[0].carbohidratos) * 4 / data[0].kcal) * 100 : 0;
        let perProteinas = data[0].proteina ? (Number(data[0].proteina) * 4 / data[0].kcal) * 100 : 0;
        let perGrasas = data[0].grasas ? (Number(data[0].grasas) * 9 / data[0].kcal) * 100 : 0;

        setCarbohidratos(perCarbohidratos);
        setProteinas(perProteinas);
        setGrasas(perGrasas);
        setKcal(Number(data[0].kcal) || 0);

        setLoading(false);

    }

    return (
        <div className="flex border-3 rounded-2xl h-[90%] shadow-[0px_5px_0px_0px_#000000]">
            <FullScreenLoader loading={loading} />
            <div className="w-2/5 relative bg-green-ground rounded-xl p-4 text-center">
                <img src="./icons/fire-3d.png" width={150} alt="Icono 3D de fuego" />
                <h5 className="font-inter font-bold text-xl">{kcal} Kcal</h5>
                <span className="absolute font-inter font-light text-xs left-0 right-0 bottom-5">Calorías por día</span>
            </div>
            <div className="w-3/5 p-4 flex flex-col justify-center">
                <ul>
                    <li className="border-b-[1px] mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full bg-green-500"></div>
                            <h6 className="font-brule font-thin text-sm">Carbohidratos</h6>
                        </div>
                        <p className="font-inter font-semibold my-2">{carbohidratos.toFixed(2)}%</p>
                    </li>
                    <li className="border-b-[1px] mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                            <h6 className="font-brule font-thin text-sm">Proteínas</h6>
                        </div>
                        <p className="font-inter font-semibold my-2">{proteinas.toFixed(2)}%</p>
                    </li>
                    <li>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full bg-red-600"></div>
                            <h6 className="font-brule font-thin text-sm">Grasas</h6>
                        </div>
                        <p className="font-inter font-semibold my-2">{grasas.toFixed(2)}%</p>
                    </li>
                </ul>
            </div>
        </div>
    )
}
