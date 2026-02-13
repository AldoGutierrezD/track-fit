import MainLayout from "@/layouts/MainLayout";
import { useState, useEffect, FormEvent } from "react";
import { EjercicioGymOptions, Rutina } from "@/types/interfaces";
import { supabase } from "@/lib/supabase";
import { validateRoutine } from "../validators/gymRoutineValidator";
import { Calendar, Dumbbell, X, Save, History } from "lucide-react";
import Select from "react-select";
import Swal from "sweetalert2";
import FullScreenLoader from "@/components/LoadingOverlay";

export default function Objetivos() {

    const [rutinas, setRutinas] = useState<Rutina[]>([]);
    const [ejercicios, setEjercicios] = useState<EjercicioGymOptions[]>([]);
    const [dia, setDia] = useState<number>(0);
    const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState<EjercicioGymOptions | null>(null);
    const [tablaEjercicios, setTablaEjercicio] = useState<EjercicioGymOptions[]>([]);
    const [refreshHistorial, setRefreshHistorial] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loadingSave, setLoadingSave] = useState(false);
    const [errors, setErrors] = useState({});
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    useEffect(() => {
        getEjercicios();
        getRutinas();
    }, [refreshHistorial]);


    //RUTINAS ACTUALES
    const getRutinas = async () => {

        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error } = await supabase.rpc(
            "get_rutinas_gym",
            {
                id_usuariod: user.id
            }
        )

        if (error || !data) {
            console.error(error);
            return
        }

        const getRutinaEjercicios: Rutina[] = await Promise.all(
            data.map(async (e: { id: string, dia: number }) => {
                const { data: ejercicios, error: errorEjercicios } = await supabase.rpc(
                    "get_rutina_gym_ejercicios",
                    { idd: e.id }
                );

                if (errorEjercicios) {
                    console.error(errorEjercicios)
                }

                return {
                    id: e.id,
                    dia: dias[e.dia - 1],
                    ejercicios: ejercicios ?? []
                }
            })
        );

        setRutinas(getRutinaEjercicios);

        setLoading(false);

    }


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
                    icon: e.icon
                }))
            )
        }

        setLoading(false);
    }


    //AGREGAR EJERCICIOS
    const addEjericio = (option: EjercicioGymOptions) => {
        setTablaEjercicio(prev =>
            prev.some(e => e.value === option.value)
                ? prev
                : [
                    ...prev,
                    {
                        value: option.value,
                        label: option.label,
                        icon: option.icon,
                        series: 0,
                        reps: 0,
                        indicaciones: ""
                    }
                ]
        )
    }


    //ACTUALIZAR SERIES/REPS/INDICACIONES
    const updateEjercicio = (id: number, key: keyof EjercicioGymOptions, valor: number | string) => {
        setTablaEjercicio(prev =>
            prev.map(e =>
                e.value === id
                    ? { ...e, [key]: valor }
                    : e
            )
        )
    }


    //ELIMINAR EJERCICIO DE LA TABLA
    const deleteEjercicio = (id: number) => {
        setTablaEjercicio(prev =>
            prev.filter(item => item.value != id)
        );
    }


    //GUARDAR
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationErrors = validateRoutine({ dia, tablaEjercicios });

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

        //ENCABEZADO
        //#region
        const { data: rutina, error: errorRutina } = await supabase.rpc(
            "set_rutina_gym",
            {
                id_usuariod: user.id,
                diad: dia
            }
        );


        if (errorRutina) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo guardar la rutina"
            });
            return
        }
        //#endregion


        //DETALLE
        //#region
        const ejerciciosPayload = tablaEjercicios.map(e => ({
            id_rutina_gym: rutina,
            id_ejercicio: e.value,
            series: Number(e.series) || 1,
            reps: Number(e.reps) || 1,
            indicaciones: e.indicaciones
        }));

        const { error: errorPayload } = await supabase.rpc(
            "set_rutina_gym_ejercicios",
            { ejercicios: ejerciciosPayload }

        );

        if (errorPayload) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudieron guardar los ejercicios de la rutina"
            });
            return
        }
        //#endregion


        resetForm();
        setLoadingSave(false);
        setRefreshHistorial(prev => prev + 1);

        Swal.fire({
            icon: "success",
            title: "Guardado",
            text: "Los datos se guardaron correctamente",
            timer: 2000,
            showConfirmButton: false
        });
    }


    //LIMPIAR FORMULARIO
    function resetForm() {
        setDia(0);
        setTablaEjercicio([]);
        setEjercicioSeleccionado(null);
    }


    return (
        <MainLayout>
            <FullScreenLoader loading={loading} />
            <h1 className="font-against text-2xl mt-6 mb-3">Rutinas del gimnasio</h1>

            <form onSubmit={handleSubmit}>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-3">

                    <div className="sm:col-span-1">
                        <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <label htmlFor="dia" className="block text-sm/6 font-medium text-gray-900">Día de la semana</label>
                        </div>
                        <div className="mt-2">
                            <select
                                value={dia}
                                onChange={(e) => setDia(Number(e.target.value))}
                                className="block w-full rounded-md bg-white px-3 py-[9px] text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-900 sm:text-sm/6"
                                id="dia"
                            >
                                <option value="0">SELECCIONE</option>
                                <option value="1">LUNES</option>
                                <option value="2">MARTES</option>
                                <option value="3">MIÉRCOLES</option>
                                <option value="4">JUEVES</option>
                                <option value="5">VIERNES</option>
                                <option value="6">SÁBADO</option>
                                <option value="7">DOMINGO</option>
                            </select>
                        </div>
                    </div>

                    <div className="sm:row-start-2 sm:col-span-1">
                        <div className="flex items-center gap-1">
                            <Dumbbell size={14} />
                            <label htmlFor="id_ejercicio" className="block text-sm/6 font-medium text-gray-900">Agregar ejercicios</label>
                        </div>
                        <div className="mt-2">
                            <Select
                                options={ejercicios}
                                id="id_ejercicio"
                                placeholder="SELECCIONE"
                                value={ejercicioSeleccionado}
                                onChange={(option) => {
                                    setEjercicioSeleccionado(option)
                                    option && addEjericio(option)
                                }}
                                isSearchable
                            />
                        </div>
                    </div>

                    <div className="col-span-full overflow-auto bg-white-ft rounded-xl border-3">
                        <table className="text-center w-full">
                            <thead className="text-black bg-[#ffcc80]">
                                <tr>
                                    <th className="whitespace-nowrap p-2"></th>
                                    <th className="whitespace-nowrap p-2">Ejercicio</th>
                                    <th className="whitespace-nowrap p-2">Series</th>
                                    <th className="whitespace-nowrap p-2">Repeticiones</th>
                                    <th className="whitespace-nowrap p-2">Indicaciones extra</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    tablaEjercicios.map(e => (
                                        <tr key={e.value}>
                                            <th className="whitespace-nowrap p-2">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        className="cursor-pointer"
                                                        title="Eliminar registro"
                                                        onClick={() => deleteEjercicio(e.value)}
                                                    >
                                                        <X size={20} className="text-red-500" />
                                                    </button>
                                                    <div className="bg-[#d5f0f9] w-12 h-12 rounded-lg flex justify-center items-center">
                                                        <Dumbbell size={24} className="text-[#1481a5]" />
                                                    </div>
                                                </div>
                                            </th>
                                            <th className="whitespace-nowrap p-2">{e.label}</th>
                                            <th className="whitespace-nowrap p-2">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={e.series}
                                                    placeholder="1"
                                                    onChange={(ev) => updateEjercicio(e.value, "series", ev.target.value === "" ? "" : Number(ev.target.value))}
                                                    className="block w-full rounded-md bg-white px-3 py-[9px] text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-900 sm:text-sm/6"
                                                />
                                            </th>
                                            <th className="whitespace-nowrap p-2">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={e.reps}
                                                    placeholder="1"
                                                    onChange={(ev) => updateEjercicio(e.value, "reps", ev.target.value === "" ? "" : Number(ev.target.value))}
                                                    className="block w-full rounded-md bg-white px-3 py-[9px] text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-900 sm:text-sm/6"
                                                />
                                            </th>
                                            <th className="whitespace-nowrap p-2">
                                                <input
                                                    type="text"
                                                    value={e.indicaciones}
                                                    placeholder="Ej.Descanso de 3 minutos..."
                                                    onChange={(ev) => updateEjercicio(e.value, "indicaciones", ev.target.value)}
                                                    className="block w-full rounded-md bg-white px-3 py-[9px] text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-900 sm:text-sm/6"
                                                />
                                            </th>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>

                    <div className="col-span-full">
                        <div className="flex items-center gap-1">
                            <button type="submit" className="btn-primary" disabled={loadingSave}> <Save size={14} />{loadingSave ? "Guardando..." : "Guardar cambios"}</button>
                        </div>
                    </div>
                </div>
            </form>

            <div className="flex items-center gap-2 mt-14 mb-3">
                <div className="square-icon square-icon-success">
                    <History size={20}></History>
                </div>
                <h2 className="font-brule text-xl">Rutina actual</h2>
            </div>

            <div className="w-full grid grid-cols-2 gap-4">
                {
                    rutinas.map(item => {
                        let letter = item.dia.substring(0, 1);

                        return (
                            <div key={item.id} className="w-full col-span-1 flex justify-start gap-2 rounded-xl p-2 border-3 relative bottom-shadow">
                                <div>
                                    <div className="w-20 h-20 rounded-lg bg-[#fee685] flex justify-center items-center">
                                        <span className="text-4xl font-against">{letter}</span>
                                    </div>
                                    <p className="text-center font-brule mt-1">{item.dia}</p>
                                </div>
                                <div>
                                    <div className="w-full flex flex-col gap-2">
                                        {
                                            item.ejercicios.map((e, index) => (
                                                <div className="flex gap-3">
                                                    <div className="square-icon-big square-icon-success">
                                                        <Dumbbell size={24} />
                                                    </div>
                                                    <div>
                                                        <p>{e.nombre}</p>
                                                        <span className="font-bold">{e.series} x {e.reps} <span className="font-light">{e.indicaciones}</span></span>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>

                        )
                    })
                }
            </div>
        </MainLayout>
    )

}
