import MainLayout from "@/layouts/MainLayout";
import { FormEvent, useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { Modal } from "@/components/Modal";
import ModalPlatillos from "@/components/modalPlatillos";
import { Save, Salad, Beef, Wheat, Droplet, X, Text, Info, ChefHat } from "lucide-react";
import { DietaPlatillo, Ingrediente, IngredienteOption, Platillo, PlatilloIngrediente, UnidadIngrediente } from "@/types/interfaces";
import Select from "react-select";
import Swal from "sweetalert2";
import FullScreenLoader from "@/components/LoadingOverlay";

export default function Sesiones() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ingredientes, setIngredientes] = useState<IngredienteOption[]>([]);
    const [ingredienteSeleccionado, setIngredienteSeleccionado] = useState<IngredienteOption | null>(null);
    const [unidades, setUnidades] = useState<UnidadIngrediente[]>([]);
    const [tablaIngredientes, setTablaIngredientes] = useState<PlatilloIngrediente[]>([]);
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [dietaId, setDietaId] = useState("");
    const [dietaPlatillos, setDietaPlatillos] = useState<DietaPlatillo[]>([]);
    const [dietaProteina, setDietaProteina] = useState<Number>(0);
    const [dietaCarbohidratos, setDietaCarbohidratos] = useState<Number>(0);
    const [dietaGrasas, setDietaGrasas] = useState<Number>(0);
    const [dietaKcal, setDietaKcal] = useState<Number>(0);
    const [activo, setActivo] = useState(false);
    const [refreshDieta, setRefreshDieta] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loadingSave, setLoadingSave] = useState(false);


    useEffect(() => {
        getIngredientes();
        getUnidades();
    }, []);


    useEffect(() => {
        getDieta();
    }, [refreshDieta])


    //UNIDADES
    const getUnidades = async () => {

        setLoading(true);

        const { data, error } = await supabase.rpc(
            "get_unidades_ingredientes"
        )

        setUnidades(data);

        setLoading(false);

    }


    //DIETA
    const getDieta = async () => {

        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error } = await supabase.rpc(
            "get_dieta",
            { id_usuariod: user.id }
        );

        if (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error al cargar los datos de la dieta"
            });
            return
        }

        setDietaId(data[0].id);
        setDietaProteina(data[0].proteina ?? 0);
        setDietaCarbohidratos(data[0].carbohidratos ?? 0);
        setDietaGrasas(data[0].grasas ?? 0);
        setDietaKcal(data[0].kcal ?? 0);

        const { data: dataDietaPlatillos, error: errorDietaPlatillos } = await supabase.rpc(
            "get_dieta_platillos",
            { id_dietad: data[0].id }
        );

        if (errorDietaPlatillos) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error al cargar las comidas de la dieta"
            });
            return
        }

        setDietaPlatillos(dataDietaPlatillos);

        setLoading(false);

    }


    //SELECCIONAR PLATILLO
    const handleSelectPlatillo = (id: string) => {
        selectPlatillo(id);
        setIsModalOpen(false);
    };

    const selectPlatillo = async (id: string) => {

        setLoading(true);

        //ENCABEZADO
        //#region
        const { data, error } = await supabase.rpc(
            "get_platillo",
            { idd: id }
        );

        if (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error al obtener los datos del platillo"
            });
            return
        }

        setNombre(data[0].nombre);
        setDescripcion(data[0].descripcion);
        //#endregion


        //DETALLE
        //#region
        const { data: dataIngredientes, error: errorIngredientes } = await supabase.rpc(
            "get_platillo_ingredientes",
            { idd: id }
        );

        if (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error al obtener los datos ingredientes del platillo"
            });
            return
        }

        setTablaIngredientes([]);
        dataIngredientes.map((item: PlatilloIngrediente) => {
            setTablaIngredientes(prev =>
                prev.some(e => e.id === item.id)
                    ? prev
                    : [
                        ...prev,
                        {
                            id: item.id,
                            nombre: item.nombre,
                            cantidad: item.cantidad,
                            id_unidad: item.id_unidad,
                            gramos_calculados: item.gramos_calculados,
                            kcal: item.kcal,
                            proteina: item.proteina,
                            carbohidratos: item.carbohidratos,
                            grasas: item.grasas,
                            gramos_por_unidad: item.gramos_por_unidad,
                            kcalTotales: item.kcalTotales,
                            proteinasTotales: item.proteinasTotales,
                            carbohidratosTotales: item.carbohidratosTotales,
                            grasasTotales: item.grasasTotales
                        }
                    ]
            )
        })
        //#endregion

        setLoading(false);

    }


    //INGREDIENTES
    const getIngredientes = async () => {

        setLoading(true);

        const { data, error } = await supabase.rpc(
            "get_ingredientes"
        );

        setIngredientes(
            data.map((e: IngredienteOption) => ({
                value: e.id,
                label: e.nombre,
                id: e.id,
                id_categoria_ingrediente: e.id_categoria_ingrediente,
                nombre: e.nombre,
                kcal: e.kcal,
                proteina: e.proteina,
                carbohidratos: e.carbohidratos,
                grasas: e.grasas,
                gramos_por_unidad: e.gramos_por_unidad
            }))
        );

        setLoading(false);

    }


    //AGREGAR INGREDIENTE
    const addIngrediente = (option: IngredienteOption) => {
        setTablaIngredientes(prev =>
            prev.some(e => e.id === option.value)
                ? prev
                : [
                    ...prev,
                    {
                        id: option.value,
                        nombre: option.label,
                        cantidad: 0,
                        id_unidad: 0,
                        gramos_calculados: 0,
                        kcal: option.kcal,
                        proteina: option.proteina,
                        carbohidratos: option.carbohidratos,
                        grasas: option.grasas,
                        gramos_por_unidad: option.gramos_por_unidad,
                        kcalTotales: 0,
                        proteinasTotales: 0,
                        carbohidratosTotales: 0,
                        grasasTotales: 0
                    }
                ]
        )
    }


    //ACTUALIZAR ARREGLO DE INGREDIENTES AGREGADOS
    const updateIngrediente = (id: number, key: keyof PlatilloIngrediente, valor: number | string) => {

        setTablaIngredientes(prev => {

            const newValues = prev.map(e => {
                if (e.id != id) return e;

                const updated = { ...e, [key]: valor }

                let cantidad = Number(updated.cantidad) ?? 0;
                let id_unidad = Number(updated.id_unidad) ?? 0;
                let gramos_por_unidad = Number(updated.gramos_por_unidad) ?? 0;

                if (id_unidad <= 0) {
                    return {
                        ...updated,
                        kcalTotales: 0,
                        proteinasTotales: 0,
                        carbohidratosTotales: 0,
                        grasasTotales: 0,
                        gramos_calculados: 0
                    };
                }

                let gramos_calculados = (id_unidad != 2) ? cantidad : (cantidad * gramos_por_unidad);

                let kcalTotales = Number(((gramos_calculados / 100) * updated.kcal).toFixed(2));
                let proteinasTotales = Number(((gramos_calculados / 100) * updated.proteina).toFixed(2));
                let carbohidratosTotales = Number(((gramos_calculados / 100) * updated.carbohidratos).toFixed(2));
                let grasasTotales = Number(((gramos_calculados / 100) * updated.grasas).toFixed(2));

                return {
                    ...updated,
                    kcalTotales,
                    proteinasTotales,
                    carbohidratosTotales,
                    grasasTotales,
                    gramos_calculados
                }

            });

            return newValues;

        });

    }


    //ELIMINAR INGREDIENTE
    const deleteIngrediente = (id: number) => {
        setTablaIngredientes(prev =>
            prev.filter(e => e.id != id)
        )
    }


    //TOTALES
    const totales = useMemo(() => {

        return tablaIngredientes.reduce((acc, e) => {
            acc.kcal += e.kcalTotales || 0;
            acc.proteina += e.proteinasTotales || 0;
            acc.carbohidratos += e.carbohidratosTotales || 0;
            acc.grasas += e.grasasTotales || 0;
            return acc;
        }, {
            kcal: 0,
            proteina: 0,
            carbohidratos: 0,
            grasas: 0
        })

    }, [tablaIngredientes]);


    //HORARIO DEL PLATILLO
    const updateDietaPlatilloHorario = async (id: string, value: string) => {

        if (!value) return

        const { data, error } = await supabase.rpc(
            "update_dieta_platillo_horario",
            {
                idd: id,
                horariod: value
            }
        );

        if (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error al actualizar el horario de la comida"
            });
            return
        }

    }


    //ELIMINAR DIETA PLATILLO
    const deleteDietaPlatillo = async (id: string) => {

        const { data, error } = await supabase.rpc(
            "delete_dieta_platillo",
            { idd: id }
        );

        if (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error al eliminar la comida del plan"
            });
            return
        }

        setDietaPlatillos(prev =>
            prev.filter(e => e.id != id)
        )

        const { data: dataMacros, error: errorMacros } = await supabase.rpc(
            "update_dieta_macros",
            {
                id_dietad: dietaId
            }
        );

        setRefreshDieta(prev => prev + 1);

    }


    //GUARDAR
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        setLoadingSave(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;


        //GUARDAR PLATILLO
        if (activo) {

            //ENCABEZADO
            //#region
            const { data, error } = await supabase.rpc(
                "set_platillo",
                {
                    nombred: nombre,
                    kcal: totales.kcal,
                    proteinad: totales.proteina,
                    carbohidratosd: totales.carbohidratos,
                    grasasd: totales.grasas
                }
            )

            if (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Error al guardar el platillo"
                });
                return
            }
            //#endregion


            //DETALLE
            //#region
            const payload = tablaIngredientes.map(e => ({
                id_platillo: data,
                id_ingrediente: e.id,
                cantidad: e.cantidad,
                id_unidad: e.id_unidad,
                gramos_calculados: e.gramos_calculados,
                kcal_totales: e.kcalTotales,
                proteina: e.proteinasTotales,
                carbohidratos: e.carbohidratosTotales,
                grasas: e.grasasTotales
            }));

            const { error: errorPayload } = await supabase.rpc(
                "set_platillo_ingredientes",
                { ingredientes: payload }
            );

            if (errorPayload) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudieron guardar los ingredientes del platillo"
                });
                return
            }
            //#endregion

        }


        //GUARDAR DIETA
        //#region

        //ENCABEZADO
        //#region
        const { data: dataDieta, error: errorDieta } = await supabase.rpc(
            "upsert_dieta",
            {
                id_usuariod: user.id,
                observacionesd: ""
            }
        );

        if (errorDieta) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error al guardar los datos de la dieta"
            });
            return
        }
        //#endregion

        //PLATILLOS
        //#region
        const { data: dataPlatillo, error: errorPlatillo } = await supabase.rpc(
            "set_dieta_platillo",
            {
                id_dietad: dataDieta,
                nombred: nombre,
                descripciond: descripcion ?? "",
                kcal: totales.kcal,
                proteinad: totales.proteina,
                carbohidratosd: totales.carbohidratos,
                grasasd: totales.grasas
            }
        )

        if (errorPlatillo) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error al guardar el platillo en la dieta"
            });
            return
        }
        //#endregion

        //INGREDIENTES
        //#region
        const payload = tablaIngredientes.map(e => ({
            id_dieta_platillo: dataPlatillo,
            id_ingrediente: e.id,
            cantidad: e.cantidad,
            id_unidad: e.id_unidad,
            gramos_calculados: e.gramos_calculados,
            kcal_totales: e.kcalTotales,
            proteina: e.proteinasTotales,
            carbohidratos: e.carbohidratosTotales,
            grasas: e.grasasTotales
        }));

        const { error: errorPayload } = await supabase.rpc(
            "set_dieta_platillo_ingredientes",
            { ingredientes: payload }
        );

        if (errorPayload) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudieron guardar los ingredientes del platillo en la dieta"
            });
            return
        }
        //#endregion

        //ACTUALIZAR MACROS
        //#region
        const { data: dataMacros, error: errorMacros } = await supabase.rpc(
            "update_dieta_macros",
            {
                id_dietad: dataDieta
            }
        );
        //#endregion

        //#endregion


        resetForm();
        setLoadingSave(false);
        setRefreshDieta(prev => prev + 1);

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
        setNombre("");
        setDescripcion("");
        setIngredienteSeleccionado(null);
        setTablaIngredientes([]);
    }


    return (
        <MainLayout>
            <FullScreenLoader loading={loading} />
            <div className="flex justify-between mt-6 mb-3">
                <div className="flex items-center gap-2">
                    <Salad size={28} />
                    <h1 className="font-against text-2xl">Planes alimenticios</h1>
                </div>

                <div>
                    <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(true)}>
                        <ChefHat size={24} />
                        Platillos guardados
                    </button>
                    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Catalogo de platillos">
                        <ModalPlatillos onSuccess={() => setIsModalOpen(false)} onSelect={handleSelectPlatillo} />
                    </Modal>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-3">

                    <div className="sm:col-span-1">
                        <div className="flex items-center gap-1">
                            <Text size={14} />
                            <label htmlFor="nombre" className="block text-sm/6 font-medium text-gray-900">Nombre</label>
                        </div>
                        <div className="mt-2">
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Ej.Pasta a la bolognesa"
                                autoComplete="off"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-900 sm:text-sm/6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-1">
                        <div className="flex items-center gap-1">
                            <Salad size={14} />
                            <label htmlFor="id_ingrediente" className="block text-sm/6 font-medium text-gray-900">Ingredientes</label>
                        </div>
                        <div className="mt-2">
                            <Select
                                options={ingredientes}
                                id="id_ingrediente"
                                placeholder="SELECCIONE"
                                value={ingredienteSeleccionado}
                                onChange={(option) => {
                                    setIngredienteSeleccionado(option)
                                    option && addIngrediente(option)
                                }}
                                isSearchable
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-1 flex justify-end items-start gap-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={activo}
                                onChange={(e) => setActivo(e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-300 peer-checked:bg-green-500 rounded-full transition-colors"></div>
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                        </label>
                        <span className="font-inter font-light text-sm ">Guardar platillo</span>
                    </div>

                    <div className="col-span-full overflow-auto bg-white-ft rounded-xl border-3">
                        <table className="text-center w-full">
                            <thead className="text-black bg-[#ffcc80]">
                                <tr>
                                    <th className="whitespace-nowrap p-2"></th>
                                    <th className="whitespace-nowrap p-2">Ingrediente</th>
                                    <th className="whitespace-nowrap p-2">Cantidad</th>
                                    <th className="whitespace-nowrap p-2">Unidad</th>
                                    <th className="whitespace-nowrap p-2">Proteína</th>
                                    <th className="whitespace-nowrap p-2">Carbohidratos</th>
                                    <th className="whitespace-nowrap p-2">Grasas</th>
                                    <th className="whitespace-nowrap p-2">Kcal Totales</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    tablaIngredientes.map(e => (
                                        <tr key={e.id}>
                                            <td className="whitespace-nowrap p-2">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        className="cursor-pointer"
                                                        title="Eliminar registro"
                                                        onClick={() => deleteIngrediente(e.id)}
                                                    >
                                                        <X size={20} className="text-red-500" />
                                                    </button>
                                                    <div className="bg-[#d5f0f9] w-12 h-12 rounded-lg flex justify-center items-center">
                                                        <Salad size={24} className="text-[#1481a5]" />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap p-2">{e.nombre}</td>
                                            <td className="whitespace-nowrap p-2">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={e.cantidad}
                                                    placeholder="1"
                                                    onChange={(ev) => updateIngrediente(e.id, "cantidad", ev.target.value === "" ? "" : Number(ev.target.value))}
                                                    className="block w-full rounded-md bg-white px-3 py-[9px] text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-900 sm:text-sm/6"
                                                />
                                            </td>
                                            <td className="whitespace-nowrap p-2">
                                                <select
                                                    value={e.id_unidad}
                                                    onChange={(ev) => updateIngrediente(e.id, "id_unidad", Number(ev.target.value))}
                                                    className="block w-full rounded-md bg-white px-3 py-[9px] text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-900 sm:text-sm/6"
                                                >
                                                    <option value="0">SELECCIONE</option>
                                                    {
                                                        unidades.map(u => (
                                                            <option value={u.id}>{u.nombre}</option>
                                                        ))
                                                    }
                                                </select>
                                            </td>
                                            <td className="whitespace-nowrap p-2">{e.proteinasTotales}</td>
                                            <td className="whitespace-nowrap p-2">{e.carbohidratosTotales}</td>
                                            <td className="whitespace-nowrap p-2">{e.grasasTotales}</td>
                                            <td className="whitespace-nowrap p-2">{e.kcalTotales}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                            <tfoot>
                                <tr className="font-bold">
                                    <td className="whitespace-nowrap p-2" colSpan={4}></td>
                                    <td className="whitespace-nowrap p-2">{totales.proteina.toFixed(2)}</td>
                                    <td className="whitespace-nowrap p-2">{totales.carbohidratos.toFixed(2)}</td>
                                    <td className="whitespace-nowrap p-2">{totales.grasas.toFixed(2)}</td>
                                    <td className="whitespace-nowrap p-2">{totales.kcal.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div className="sm:col-span-full">
                        <div className="flex items-center gap-1">
                            <Info size={14} />
                            <label htmlFor="descripcion" className="block text-sm/6 font-medium text-gray-900">Indicaciones extra</label>
                        </div>
                        <div className="mt-2">
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                placeholder="Añade indicaciones extra como el modo de preparación, porciones, etc."
                                autoComplete="off"
                                rows={4}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-900 sm:text-sm/6"
                            ></textarea>
                        </div>
                    </div>

                    <div className="col-span-full">
                        <div className="flex items-center gap-1">
                            <button type="submit" className="btn-primary" disabled={loadingSave}> <Save size={14} />{loadingSave ? "Guardando..." : "Cargar platillo"}</button>
                        </div>
                    </div>
                </div>
            </form>

            <div className="flex items-center gap-2 mt-14 mb-3">
                <div className="square-icon square-icon-success">
                    <Salad size={20} />
                </div>
                <h2 className="font-brule text-xl">Dieta actual</h2>
            </div>

            <div className="w-full">
                <table className="text-center w-full">
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th>Proteína</th>
                            <th>Carbohidratos</th>
                            <th>Grasas</th>
                            <th>Kcal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            dietaPlatillos.map(item => {
                                return (
                                    <tr key={item.id}>
                                        <td className="whitespace-nowrap p-2">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    className="cursor-pointer"
                                                    title="Eliminar registro"
                                                    onClick={(e) => deleteDietaPlatillo(item.id)}
                                                >
                                                    <X size={20} className="text-red-500" />
                                                </button>
                                                <div className="square-icon-big square-icon-warning">
                                                    <Salad size={24} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap p-2">
                                            <div className="mt-2">
                                                <input
                                                    type="time"
                                                    name="horario"
                                                    value={item.horario}
                                                    onChange={(e) => updateDietaPlatilloHorario(item.id, e.target.value)}
                                                    autoComplete="off"
                                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-900 sm:text-sm/6"
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            {item.nombre}
                                        </td>
                                        <td>
                                            {item.descripcion}
                                        </td>
                                        <td className="whitespace-nowrap p-2">
                                            <span className="badge badge-success text-xs">
                                                <Beef size={12} />
                                                {item.proteina} gr
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap p-2">
                                            <span className="badge badge-info text-xs">
                                                <Wheat size={12} />
                                                {item.carbohidratos} gr
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap p-2">
                                            <span className="badge badge-danger text-xs">
                                                <Droplet size={12} />
                                                {item.grasas} gr
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap p-2">
                                            <span className="badge badge-warning text-xs">
                                                <Droplet size={12} />
                                                {item.kcal_totales} gr
                                            </span>
                                        </td>
                                    </tr>

                                )
                            })
                        }
                    </tbody>
                    <tfoot>
                        <tr className="font-bold">
                            <td className="whitespace-nowrap p-2" colSpan={4}></td>
                            <td className="whitespace-nowrap p-2">{dietaProteina.toFixed(2)}</td>
                            <td className="whitespace-nowrap p-2">{dietaCarbohidratos.toFixed(2)}</td>
                            <td className="whitespace-nowrap p-2">{dietaGrasas.toFixed(2)}</td>
                            <td className="whitespace-nowrap p-2">{dietaKcal.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </MainLayout>
    )

}
