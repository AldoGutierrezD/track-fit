import MainLayout from "@/layouts/MainLayout";
import { useState, useEffect, FormEvent } from "react";
import { Medicion, Objetivo } from "@/types/interfaces";
import { supabase } from "@/lib/supabase";
import { Text, Goal, Save } from "lucide-react";
import Swal from "sweetalert2";
import FullScreenLoader from "@/components/LoadingOverlay";

export default function Objetivos() {

    const [idMedicion, setIdMedicion] = useState("");
    const [nombre, setNombre] = useState("");
    const [valor, setValor] = useState("");
    const [mediciones, setMediciones] = useState<Medicion[]>([]);
    const [objetivos, setObjetivos] = useState<Objetivo[]>([]);
    const [refreshHistorial, setRefreshHistorial] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loadingSave, setLoadingSave] = useState(false);


    useEffect(() => {
        getMediciones();
        getObjetivos();
    }, [refreshHistorial]);


    //PARAMETROS A MEDIR
    const getMediciones = async () => {

        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error } = await supabase.rpc(
            "get_mediciones"
        );

        if (!error) {
            setMediciones(data || []);
        }

        setLoading(false);
    }


    //OBJETIVOS
    const getObjetivos = async () => {

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error } = await supabase.rpc(
            "get_objetivos",
            { id_usuariod: user.id }
        );

        if (!error) {
            setObjetivos(data);
        }

    }


    //GUARDAR
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoadingSave(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error } = await supabase.rpc(
            "set_objetivo",
            {
                id_usuariod: user.id,
                id_mediciond: Number(idMedicion),
                descripciond: nombre,
                valord: Number(valor)
            }
        );

        if (!error) {
            Swal.fire({
                icon: "success",
                title: "Guardado",
                text: "Los datos se guardaron correctamente",
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo guardar el objetivo"
            });
        }

        setRefreshHistorial(prev => prev + 1);
    }


    //ACTUALIZAR ESTADO DEL OBJETIVO
    const handleChangeEstado = async (idObjetivo: string, checked: boolean) => {

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        if (!checked) {
            const activos = objetivos.filter(o => o.estado == 1);

            if (activos.length === 1) {
                Swal.fire({
                    icon: "warning",
                    title: "Advertencia",
                    text: "Debe existir al menos un objetivo activo"
                });
                return
            }
        }

        let nuevoEstado = checked ? 1 : 0;

        const { data, error } = await supabase.rpc(
            "update_objetivo_estado",
            {
                idd: idObjetivo,
                id_usuariod: user.id,
                estadod: nuevoEstado
            }
        );

        if (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo guardar el objetivo"
            });
        }

        setRefreshHistorial(prev => prev + 1);
    }

    return (
        <MainLayout>
            <FullScreenLoader loading={loading} />
            <div className="flex items-center gap-2 mt-6 mb-3">
                <Goal size={28} />
                <h1 className="font-against text-2xl">Objetivos establecidos</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-3">

                    <div className="sm:col-span-1">
                        <div className="flex items-center gap-1">
                            <label htmlFor="id_medicion" className="block text-sm/6 font-medium text-gray-900">Parámetro a seguir</label>
                        </div>
                        <div className="mt-2">
                            <select
                                value={idMedicion}
                                onChange={(e) => setIdMedicion(e.target.value)}
                                className="block w-full rounded-md bg-white px-3 py-[9px] text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-900 sm:text-sm/6"
                                id="id_medicion"
                            >
                                <option value="0">SELECCIONE</option>
                                {
                                    mediciones.map((item) => (
                                        <option value={item.id}>{item.nombre}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>

                    <div className="sm:col-span-1">
                        <div className="flex items-center gap-1">
                            <Text size={14} />
                            <label htmlFor="nombre" className="block text-sm/6 font-medium text-gray-900">Descripción del objetivo</label>
                        </div>
                        <div className="mt-2">
                            <input
                                id="nombre"
                                type="text"
                                name="nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Ej.Aumentar 10kg"
                                autoComplete="off"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-900 sm:text-sm/6" />
                        </div>
                    </div>

                    <div className="sm:col-span-1">
                        <div className="flex items-center gap-1">
                            <Goal size={14} />
                            <label htmlFor="valor" className="block text-sm/6 font-medium text-gray-900">Valor a conseguir</label>
                        </div>
                        <div className="mt-2">
                            <input
                                id="valor"
                                type="number"
                                name="valor"
                                value={valor}
                                onChange={(e) => setValor(e.target.value)}
                                placeholder="Ej.80kg"
                                min="0"
                                autoComplete="off"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-900 sm:text-sm/6" />
                        </div>
                    </div>

                    <div className="col-span-full">
                        <div className="flex items-center gap-1">
                            <button type="submit" className="btn-primary" disabled={loadingSave}> <Save size={14} />{loadingSave ? "Guardando..." : "Guardar cambios"}</button>
                        </div>
                    </div>
                </div>
            </form>


            <div className="flex items-center gap-2 mt-14 mb-3">
                <div className="bg-[#d5f0f9] w-8 h-8 rounded-lg flex justify-center items-center">
                    <Goal size={20} className="text-[#1481a5]"></Goal>
                </div>
                <h2 className="font-brule text-xl">Objetivos programados</h2>
            </div>

            <div className="w-full">
                <div className="w-2/3 overflow-auto bg-white-ft rounded-xl border-2">
                    <table className="text-center w-full">
                        <thead className="text-black bg-[#a3e4fa]">
                            <tr>
                                <th className="whitespace-nowrap p-2"></th>
                                <th className="whitespace-nowrap p-2">Parámetro</th>
                                <th className="whitespace-nowrap p-2">Objetivo</th>
                                <th className="whitespace-nowrap p-2">Estatus</th>
                            </tr>
                        </thead>
                        {
                            objetivos.map(item => {
                                let estatus = (item.estado == 1)
                                    ? <span className='badge badge-success'>Activo</span>
                                    : <span className='badge badge-danger'>Inactivo</span>;

                                return (
                                    <tr key={item.id}>
                                        <td className="whitespace-nowrap p-2">
                                            <input
                                                type="checkbox"
                                                checked={item.estado == 1}
                                                onChange={(e) => handleChangeEstado(item.id, e.target.checked)}
                                            />
                                        </td>
                                        <td className="whitespace-nowrap p-2">{item.medicion}</td>
                                        <td className="whitespace-nowrap p-2">{item.descripcion}</td>
                                        <td className="whitespace-nowrap p-2">{estatus}</td>
                                    </tr>
                                )
                            })
                        }
                    </table>
                </div>
            </div>
        </MainLayout>
    )

}
