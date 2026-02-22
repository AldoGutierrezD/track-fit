import { useState, useEffect, FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { Platillo } from "@/types/interfaces";
import { Salad, Beef, Wheat, Droplet } from "lucide-react";
import FullScreenLoader from "./LoadingOverlay";
import { usePaginatedTable } from "@/hooks/usePaginatedTable";


type Props = {
    onSuccess: () => void;
    onSelect: (id: string) => void;
}


export default function ModalPlatillos({ onSuccess, onSelect }: Props) {

    const itemsPerPage = 10;

    const {
        data: platillos,
        search,
        setSearch,
        currentPage,
        setCurrentPage,
        totalPages,
        loading
    } = usePaginatedTable<Platillo>("get_platillos_filtered", itemsPerPage);

    return (
        <div className="w-full">
            <FullScreenLoader loading={loading} />

            <input
                type="text"
                placeholder="Buscar platillo..."
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value)
                    setCurrentPage(1)
                }}
                autoComplete="off"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-900 sm:text-sm/6"
            />

            <table className="text-center w-full">
                <thead>
                    <tr>
                        <th className="whitespace-nowrap p-2"></th>
                        <th className="whitespace-nowrap p-2">Platillo</th>
                        <th className="whitespace-nowrap p-2">Proteína</th>
                        <th className="whitespace-nowrap p-2">Carbohidratos</th>
                        <th className="whitespace-nowrap p-2">Grasas</th>
                        <th className="whitespace-nowrap p-2">Kcal</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        platillos.map(item => {
                            return (
                                <tr
                                    key={item.id}
                                    onClick={(e) => onSelect(item.id)}
                                    className="cursor-pointer hover:bg-slate-100"
                                >
                                    <td className="whitespace-nowrap p-2">
                                        <div className="flex items-center gap-2">
                                            <div className="square-icon-big square-icon-warning">
                                                <Salad size={24} />
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {item.nombre}
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
            </table>

            <span className="font-inter text-sm text-slate-500 mt-2">Mostrando {itemsPerPage} registros por página</span>

            <div className="flex justify-center gap-2 mt-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`cursor-pointer px-3 py-1 border-2 border-black rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : ""
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    )

}
