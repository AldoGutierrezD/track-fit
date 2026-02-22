import { DietaPlatilloIngrediente } from "@/types/interfaces"
import { Salad, Beef, Wheat, Droplet } from "lucide-react"

type Item = {
    color: string,
    hour: string,
    name: string,
    carbs: number,
    protein: number,
    fat: number,
    ingredients: DietaPlatilloIngrediente[]
}

export default function ItemFood({ color, hour, name, carbs, protein, fat, ingredients }: Item) {

    const formatHour24 = (time: string) => {
        const [hour, minute] = time.split(":");
        const ampm = parseInt(hour) >= 12 ? "PM" : "AM";
        return `${hour}:${minute} ${ampm}`;
    };

    return (
        <div className={`flex flex-col h-full border-3 ${color} rounded-2xl p-2 shadow-[0px_5px_0px_0px_#000000]`}>
            <div className="flex justify-between items-center">
                <h5 className="font-inter font-semibold text-base">{name}</h5>
                <span className="font-inter font-semibold text-base">{formatHour24(hour)}</span>
            </div>
            <div className="w-full mt-2">
                {
                    ingredients.map((item, index) => (
                        <div className="flex items-center gap-2 mb-1">
                            <div className="square-icon square-icon-success">
                                <Salad size={20} />
                            </div>
                            <h5 className="font-inter text-sm">{item.cantidad}{item.unidad} de {item.nombre}</h5>
                        </div>
                    ))
                }
            </div>
            <div className="flex gap-2 mt-auto">
                <span className="bg-green-300 text-green-700 text-xs font-inter font-semibold py-1 px-2 rounded-lg flex items-center gap-1">
                    <Beef size={12} />
                    {protein} gr
                </span>
                <span className="bg-blue-300 text-blue-700 text-xs font-inter font-semibold py-1 px-2 rounded-lg flex items-center gap-1">
                    <Wheat size={12} />
                    {carbs} gr
                </span>
                <span className="bg-red-300 text-red-600 text-xs font-inter font-semibold py-1 px-2 rounded-lg flex items-center gap-1">
                    <Droplet size={12} />
                    {fat} %
                </span>
            </div>
        </div>
    )
}
