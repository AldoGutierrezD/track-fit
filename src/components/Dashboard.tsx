import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import MacrosDia from "./MacrosDia"
import CuerpoHoy from "./CuerpoHoy"
import Objetivo from "./Objetivo"
import GymRoutine from "./GymRoutine"
import GymPR from "./GymPR"
import { Modal } from "./Modal"
import ModalPR from "./ModalPR"
import Diet from "./Diet"
import { supabase } from "@/lib/supabase"
import { EjercicioGymPR } from "@/types/interfaces"
import WeightChart from "./WeightChart"
import FatChart from "./FatChart"
import BodyMassChart from "./BodyMassChart"
import BicepChart from "./BicepChart"

export default function Dashboard() {

    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    let date = new Date();
    let dayNumber = date.getDay();
    let day = dias[dayNumber];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ejerciciosPR, setEjerciciosPR] = useState<EjercicioGymPR[]>([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        getEjerciciosPR();
    }, []);


    const getEjerciciosPR = async () => {

        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return

        const { data, error } = await supabase.rpc(
            "get_ejercicios_gym_pr",
            { id_usuariod: user.id }
        );

        if (!error) {
            setEjerciciosPR(data);
        }

        setLoading(false);

    }

    return (
        <section>
            <h1 className="font-against text-2xl mt-6">Hola, Aldo!</h1>
            <h4 className="font-brule text-base font-light">Espero que tengas un excelente {day}</h4>

            <section className="w-full grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-4 items-stretch mt-4">
                <div className="col-span-full lg:col-span-2 xl:col-span-1">
                    <h4 className="font-inter font-semibold text-lg mb-1">Macros del día</h4>
                    <MacrosDia />
                </div>
                <div className="col-span-full lg:col-span-2 xl:col-span-1">
                    <h4 className="font-inter font-semibold text-lg mb-1">Tu cuerpo hoy</h4>
                    <CuerpoHoy />
                </div>
                <div className="col-span-full lg:col-span-2 xl:col-span-1">
                    <h4 className="font-inter font-semibold text-lg mb-1">Objetivo principal</h4>
                    <Objetivo />
                </div>
            </section>

            <section className="w-full grid grid-cols-3 gap-4 mt-8">
                <div className="col-span-full">
                    <GymRoutine />
                </div>
                <div className="col-span-full">
                    <div className="flex justify-between">
                        <h4 className="font-inter font-semibold text-lg mb-1">Esto es PR mami 🔥</h4>
                        <button type="button" className="btn-primary" onClick={() => setIsModalOpen(true)}>
                            <Plus size={24} />
                            Nuevo PR
                        </button>
                        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrar nuevo PR">
                            <ModalPR onSuccess={() => setIsModalOpen(false)} refreshData={() => getEjerciciosPR()} />
                        </Modal>
                    </div>
                    <GymPR ejercicios={ejerciciosPR} />
                </div>
            </section>

            <section className="w-full mt-12">
                <div className="col-span-2">
                    <h4 className="font-inter font-semibold text-lg mb-1">Hora de comer</h4>
                    <Diet />
                </div>
            </section>

            <section className="w-full mt-12">
                <h4 className="font-inter font-semibold text-lg mb-1">Estadísticas</h4>
                <div className="w-full grid grid-cols-3 gap-4 items-stretch">
                    <div className="col-span-full xl:col-span-2">
                        <WeightChart />
                    </div>
                    <div className="col-span-full xl:col-span-1">
                        <FatChart />
                        <BodyMassChart />
                    </div>
                </div>
            </section>
        </section>
    )
}
