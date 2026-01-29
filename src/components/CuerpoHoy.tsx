import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase";
import ItemCuerpoHoy from "./ItemCuerpoHoy";
import FullScreenLoader from "./LoadingOverlay";

export default function CuerpoHoy() {

    const [peso, setPeso] = useState(0);
    const [masa, setMasa] = useState(0);
    const [grasa, setGrasa] = useState(0);
    const [brazo, setBrazo] = useState(0);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        getEstadisticas();
    }, []);


    const getEstadisticas = async () => {

        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error } = await supabase.rpc(
            "get_sesion_medicion_ultima",
            { id_usuariod: user.id }
        );

        if (!error) {
            setPeso(data[0].peso);
            setMasa(data[0].masa);
            setGrasa(data[0].grasa);
            setBrazo(data[0].brazo);
        }

        setLoading(false);

    }

    const items = [
        {
            background: 'bg-gradient-to-t from-blue-200 to-cyan-200',//'bg-[#ffe36d]',
            image: 'weight.webp',
            value: `${peso} KG`,
            title: 'Peso corporal'
        },
        {
            background: 'bg-gradient-to-t from-violet-200 to-pink-200',//'bg-[#fd9497]',
            image: 'strenght.webp',
            value: `${masa}%`,
            title: 'Masa muscular'
        },
        {
            background: 'bg-gradient-to-t from-amber-100 to-yellow-300',//'bg-[#d4bff5]',
            image: 'fat.webp',
            value: `${grasa}%`,
            title: 'Grasa'
        },
        {
            background: 'bg-gradient-to-t from-lime-100 to-green-300',//'bg-[#b3e3ae]',
            image: 'bicep.webp',
            value: `${brazo} cm`,
            title: 'Bicep'
        }
    ]

    return (
        <div className="grid grid-cols-2 gap-4 h-[90%]">
            <FullScreenLoader loading={loading} />
            {
                items.map((element, index) => (
                    <ItemCuerpoHoy key={index} background={element.background} image={element.image} value={element.value} title={element.title} />
                ))
            }
        </div>
    )
}
