import MainLayout from "@/layouts/MainLayout";
import { FormEvent, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { login } from "../services/authService";
import { validateMacros } from "../validators/macrosValidator";
import { Beef, Wheat, Droplet, Save } from "lucide-react"
import Swal from "sweetalert2";
import FullScreenLoader from "@/components/LoadingOverlay";

export default function MacrosDia() {

    const [carbohidratos, setCarbohidratos] = useState("");
    const [proteinas, setProteinas] = useState("");
    const [grasas, setGrasas] = useState("");
    const [kcal, setKcal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});


    useEffect(() => {
        login();
        getMacros();
    }, []);


    useEffect(() => {

        const c = Number(carbohidratos) || 0;
        const p = Number(proteinas) || 0;
        const g = Number(grasas) || 0;

        const total = (c * 4) + (p * 4) + (g * 9);
        setKcal(total);

    }, [carbohidratos, proteinas, grasas]);


    const getMacros = async () => {

        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error } = await supabase
            .from("rt_usuarios_macros")
            .select("carbohidratos, proteinas, grasas, kcal_totales, created_at")
            .eq("id_usuario", user.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        if (error || !data) {
            setCarbohidratos("");
            setProteinas("");
            setGrasas("");
            setKcal(0);
            return
        }

        setCarbohidratos(data.carbohidratos || "");
        setProteinas(data.proteinas || "");
        setGrasas(data.grasas || "");
        setKcal(Number(data.kcal_totales) || 0);

        setLoading(false);

    }


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationErrors = validateMacros({ carbohidratos, proteinas, grasas });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);

            Swal.fire({
                icon: "warning",
                title: "Datos inválidos",
                text: "Revisa los valores ingresados"
            });

            return;
        }

        setErrors({});
        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return

        const { error } = await supabase
            .from("rt_usuarios_macros")
            .insert([{
                id_usuario: user.id,
                carbohidratos: Number(carbohidratos),
                proteinas: Number(proteinas),
                grasas: Number(grasas),
                kcal_totales: Number(kcal)
            }]);

        setLoading(false);

        if (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudieron guardar los datos"
            });
        } else {
            Swal.fire({
                icon: "success",
                title: "Guardado",
                text: "Los datos se guardaron correctamente",
                timer: 2000,
                showConfirmButton: false
            });
        }
    }


    return (
        <MainLayout>
            <FullScreenLoader loading={loading} />
            <h1 className="font-against text-2xl mt-6 mb-3">Macros del día</h1>
            <form onSubmit={handleSubmit}>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-3">
                    <div className="col-span-full">
                        <div className="flex items-center gap-1">
                            <span className="badge badge-warning">{kcal} kcal</span>
                            <p>por día</p>
                        </div>
                    </div>

                    <div className="sm:col-span-1">
                        <div className="flex items-center gap-1">
                            <Wheat size={14} />
                            <label htmlFor="carbohidratos" className="block text-sm/6 font-medium text-gray-900">Carbohidratos (gr)</label>
                        </div>
                        <div className="mt-2">
                            <input
                                id="carbohidratos"
                                type="number"
                                name="carbohidratos"
                                value={carbohidratos}
                                onChange={(e) => setCarbohidratos(e.target.value)}
                                placeholder="Ej. 250 gr"
                                min="0"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-900 sm:text-sm/6" />
                        </div>
                    </div>

                    <div className="sm:col-span-1">
                        <div className="flex items-center gap-1">
                            <Beef size={14} />
                            <label htmlFor="proteinas" className="block text-sm/6 font-medium text-gray-900">Proteínas (gr)</label>
                        </div>
                        <div className="mt-2">
                            <input
                                id="proteinas"
                                type="number"
                                name="proteinas"
                                value={proteinas}
                                onChange={(e) => setProteinas(e.target.value)}
                                placeholder="Ej. 100 gr"
                                min="0"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-900 sm:text-sm/6" />
                        </div>
                    </div>

                    <div className="sm:col-span-1">
                        <div className="flex items-center gap-1">
                            <Droplet size={14} />
                            <label htmlFor="grasas" className="block text-sm/6 font-medium text-gray-900">Grasas (gr)</label>
                        </div>
                        <div className="mt-2">
                            <input
                                id="grasas"
                                type="number"
                                name="grasas"
                                value={grasas}
                                onChange={(e) => setGrasas(e.target.value)}
                                placeholder="Ej. 80 gr"
                                min="0"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-900 sm:text-sm/6" />
                        </div>
                    </div>

                    <div className="col-span-full">
                        <div className="flex items-center gap-1">
                            <button type="submit" className="btn-primary" disabled={loading}> <Save size={14} />{loading ? "Guardando..." : "Guardar cambios"}</button>
                        </div>
                    </div>
                </div>
            </form>
        </MainLayout>
    )
}
