import { useState, useEffect, FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { Calendar, Dumbbell, RotateCw, X, Weight, Save } from "lucide-react";
import { EjercicioGymOptions } from "@/types/interfaces";
import { validateGymPR } from "@/validators/gymPRValidator";
import Select from "react-select";
import Swal from "sweetalert2";
import FullScreenLoader from "@/components/LoadingOverlay";


type Props = {
    onSuccess: () => void;
    refreshData: () => void;
};


export default function ModalPR({ onSuccess, refreshData }: Props) {

    const currentDate = new Date().toISOString().split('T')[0];

    const [ejercicios, setEjercicios] = useState<EjercicioGymOptions[]>([]);
    const [ejercicio, setEjercicio] = useState<number | null>(null);
    const [fecha, setFecha] = useState(currentDate);
    const [series, setSeries] = useState("");
    const [reps, setReps] = useState("");
    const [peso, setPeso] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingSave, setLoadingSave] = useState(false);


    useEffect(() => {
        getEjercicios();
    }, []);


    //EJERCICIOS
    const getEjercicios = async () => {

        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error } = await supabase.rpc(
            "get_ejercicios_gym"
        );

        if (!error) {
            setEjercicios(
                data.map((e: { id: number; nombre: string; icon: string }) => ({
                    value: e.id,
                    label: e.nombre,
                    icon: e.icon,
                    series: "",
                    reps: "",
                    indicaciones: ""
                }))
            )
        }

        setLoading(false);
    }


    //GUARDAR
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        const validationErrors = validateGymPR({ fecha, ejercicio, series, reps, peso });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            const firstError = Object.values(validationErrors)[0];

            Swal.fire({
                icon: "warning",
                title: "Datos incorrectos",
                text: firstError
            });

            return;
        }

        setErrors({});
        setLoadingSave(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error } = await supabase.rpc(
            "set_ejercicio_gym_pr",
            {
                id_usuariod: user.id,
                fechad: fecha,
                id_ejerciciod: ejercicio,
                seriesd: series,
                repsd: reps,
                pesod: peso
            }
        );

        if (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error al registrar el nuevo PR"
            });
            return
        }

        resetForm();
        setLoadingSave(false);

        Swal.fire({
            icon: "success",
            title: "Guardado",
            text: "Los datos se guardaron correctamente",
            timer: 2000,
            showConfirmButton: false
        });

        onSuccess();
        refreshData();

    }


    //LIMPIAR FORMULARIO
    function resetForm() {
        setFecha(currentDate);
        setEjercicio(null);
        setSeries("");
        setReps("");
        setPeso("");
    }


    return (
        <form onSubmit={handleSubmit}>
            <FullScreenLoader loading={loading} />
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">

                <div className="col-span-full">
                    <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <label htmlFor="id_ejercicio" className="block text-sm/6 font-medium text-gray-900">Fecha</label>
                    </div>
                    <div className="mt-2">
                        <input
                            id="fecha"
                            type="date"
                            name="fecha"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-900 sm:text-sm/6" />
                    </div>
                </div>

                <div className="col-span-full">
                    <div className="flex items-center gap-1">
                        <Dumbbell size={14} />
                        <label htmlFor="id_ejercicio" className="block text-sm/6 font-medium text-gray-900">Ejercicio</label>
                    </div>
                    <div className="mt-2">
                        <Select
                            options={ejercicios}
                            id="id_ejercicio"
                            placeholder="Seleccionar ejercicio"
                            value={ejercicios.find(e => e.value === ejercicio) || null}
                            onChange={(option) => setEjercicio(option?.value ?? null)}
                            isSearchable
                        />
                    </div>
                </div>

                <div className="col-span-1">
                    <div className="flex items-center gap-1">
                        <RotateCw size={14} />
                        <label htmlFor="series" className="block text-sm/6 font-medium text-gray-900">Series</label>
                    </div>
                    <div className="mt-2">
                        <input
                            id="series"
                            type="number"
                            name="series"
                            value={series}
                            onChange={(e) => setSeries(e.target.value)}
                            placeholder="0"
                            autoComplete="off"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-900 sm:text-sm/6" />
                    </div>
                </div>

                <div className="col-span-1">
                    <div className="flex items-center gap-1">
                        <X size={14} />
                        <label htmlFor="reps" className="block text-sm/6 font-medium text-gray-900">Repeticiones</label>
                    </div>
                    <div className="mt-2">
                        <input
                            id="reps"
                            type="number"
                            name="reps"
                            value={reps}
                            onChange={(e) => setReps(e.target.value)}
                            placeholder="0"
                            autoComplete="off"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-900 sm:text-sm/6" />
                    </div>
                </div>

                <div className="col-span-full">
                    <div className="flex items-center gap-1">
                        <Weight size={14} />
                        <label htmlFor="peso" className="block text-sm/6 font-medium text-gray-900">Nuevo peso (KG)</label>
                    </div>
                    <div className="mt-2">
                        <input
                            id="peso"
                            type="number"
                            name="peso"
                            value={peso}
                            onChange={(e) => setPeso(e.target.value)}
                            placeholder="0"
                            autoComplete="off"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-900 sm:text-sm/6" />
                    </div>
                </div>

                <div className="col-span-full">
                    <div className="flex justify-end items-center gap-1">
                        <button type="submit" className="btn-primary" disabled={loadingSave}> <Save size={14} />{loadingSave ? "Guardando..." : "Registrar PR"}</button>
                    </div>
                </div>
            </div>
        </form>
    )

}
