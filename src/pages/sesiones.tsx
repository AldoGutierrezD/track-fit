import MainLayout from "@/layouts/MainLayout";
import { FormEvent, useState, useEffect } from "react";
import { Medicion, SesionMedicionRow } from "@/types/interfaces";
import { supabase } from "@/lib/supabase";
import { login } from "@/services/authService";
import { Save, Calendar, NotepadText, History } from "lucide-react";
import Swal from "sweetalert2";
import FullScreenLoader from "@/components/LoadingOverlay";

export default function Sesiones() {

    const currentDate = new Date().toISOString().split('T')[0];

    const [fecha, setFecha] = useState(currentDate);
    const [mediciones, setMediciones] = useState<Medicion[]>([]);
    const [historial, setHistorial] = useState<Record<string, SesionMedicionRow[]>>({});
    const [refreshHistorial, setRefreshHistorial] = useState(0);
    const [observaciones, setObservaciones] = useState("");
    const [valores, setValores] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [loadingSave, setLoadingSave] = useState(false);


    useEffect(() => {
        getMediciones();
        getHistorial();
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


    //HISTORIAL
    const getHistorial = async () => {

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return

        const { data, error } = await supabase.rpc(
            "get_sesiones_mediciones",
            {
                id_usuariod: user.id
            }
        );

        if (!data) return;

        const rows = data as SesionMedicionRow[];

        const groupedByFecha: Record<string, SesionMedicionRow[]> = {};

        rows.forEach(item => {
            if (!groupedByFecha[item.fecha]) {
                groupedByFecha[item.fecha] = [];
            }
            groupedByFecha[item.fecha].push(item);
        });

        setHistorial(groupedByFecha);

    }


    //VALOR POR DEFECTO DE LOS PARAMETROS DE MEDICION
    useEffect(() => {
        if (mediciones.length > 0) {
            const inicial: Record<string, string> = {};

            mediciones.forEach((m) => {
                inicial[m.id] = "0";
            });

            setValores(inicial);
        }
    }, [mediciones]);


    //GUARDAR
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoadingSave(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return

        //ENCABEZADO DE LA SESION
        //#region
        const { data: sesion, error: errorSesion } = await supabase.rpc(
            "set_sesion",
            {
                id_usuariod: user.id,
                fechad: fecha,
                observacionesd: observaciones
            }
        )

        if (errorSesion || !sesion) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo guardar la sesión"
            });
            return
        }
        //#endregion


        //DETALLE DE LA SESION
        //#region
        const medicionesPayload = Object.entries(valores).map(
            ([id_medicion, valor]) => ({
                id_sesion: sesion,
                id_medicion,
                valor: valor === "" ? 0 : Number(valor)
            })
        );

        const { error: errorMediciones } = await supabase.rpc(
            "set_sesion_mediciones",
            { mediciones: medicionesPayload }
        );

        if (errorMediciones) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudieron guardar los datos"
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

        const resetValores: Record<string, string> = {};
        mediciones.forEach((m) => {
            resetValores[m.id] = "0";
        });
        setValores(resetValores);

        setFecha(currentDate);
        setObservaciones("");

    }

    return (
        <MainLayout>
            <FullScreenLoader loading={loading} />
            <div className="flex items-center gap-2 mt-6 mb-3">
                <Calendar size={28} />
                <h1 className="font-against text-2xl">Nueva sesión</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-3">

                    <div className="sm:col-span-1">
                        <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <label htmlFor="fecha" className="block text-sm/6 font-medium text-gray-900">Fecha de la sesión</label>
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

                    <div className="col-span-full overflow-auto bg-white-ft rounded-xl border-2">
                        <table className="w-full">
                            <thead>
                                <tr className="text-black bg-[#ffcc80]">
                                    <th className="p-2">Medición</th>
                                    <th className="p-2">Valor</th>
                                    <th className="p-2">Unidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    mediciones.map((item) => (
                                        <tr key={item.id}>
                                            <td className="p-1 pl-6">{item.nombre}</td>
                                            <td className="p-1">
                                                <input
                                                    type="number"
                                                    id={item.id}
                                                    name={item.id}
                                                    value={valores[item.id]}
                                                    min="0"
                                                    step="any"
                                                    onChange={(e) => setValores({ ...valores, [item.id]: e.target.value })}
                                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-900 sm:text-sm/6"
                                                />
                                            </td>
                                            <td className="p-1 text-center">{item.unidad}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>

                    <div className="col-span-full">
                        <div className="flex items-center gap-1">
                            <NotepadText size={14} />
                            <label htmlFor="fecha" className="block text-sm/6 font-medium text-gray-900">Comentarios adicionales</label>
                        </div>
                        <div className="mt-2">
                            <textarea
                                id="observaciones"
                                name="observaciones"
                                value={observaciones}
                                onChange={(e) => setObservaciones(e.target.value)}
                                placeholder="¿Necesitas agregar algún detalle de la sesión?"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-900 sm:text-sm/6"
                            ></textarea>
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
                    <History size={20} className="text-[#1481a5]"></History>
                </div>
                <h2 className="font-brule text-xl">Historial de sesiones</h2>
            </div>

            <div className="w-full">
                <div className="w-full overflow-auto bg-white-ft rounded-xl border-2">
                    <table className="text-center">
                        <thead className="text-black bg-[#a3e4fa]">
                            <tr>
                                <th className="whitespace-nowrap p-2">Fecha</th>
                                {
                                    mediciones.map((item) => (
                                        <th className="p-2">{item.nombre}</th>
                                    ))
                                }
                            </tr>
                        </thead>
                        {
                            Object.entries(historial).map(([fecha, sesiones]) => (
                                <tr>
                                    <td className="whitespace-nowrap p-2">{fecha}</td>
                                    {
                                        sesiones.map(item => (
                                            <td className="whitespace-nowrap p-2">{item.valor} {item.unidad}</td>
                                        ))
                                    }
                                </tr>
                            ))
                        }
                    </table>
                </div>
            </div>
        </MainLayout>
    )

}
