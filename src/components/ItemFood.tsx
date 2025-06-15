import { Beef, Wheat, Droplet } from "lucide-react"

type Item = {
    color: string,
    foodType: string,
    hour: string,
    name: string,
    images: string[],
    carbs: number,
    protein: number,
    fat: number
}

export default function ItemFood({ color, foodType, hour, name, images, carbs, protein, fat }: Item) {
    return (
        <div className={`border-[1px] ${color} rounded-2xl p-2`}>
            <div className="flex justify-between items-center">
                <h6 className="font-inter font-semibold text-base">{foodType}</h6>
                <span className="font-inter font-semibold text-base">{hour}</span>
            </div>
            <h5 className="font-inter font-light text-base">{name}</h5>
            <div className="flex gap-0 mt-4 ml-3">
                {
                    images.map((name, index) => (
                        <img key={index} src={`./images/food/${name}`} className="w-14 h-14 rounded-full object-cover -ml-3 shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)]" />
                    ))
                }
            </div>
            <div className="flex gap-2 mt-4">
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
