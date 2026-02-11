import { Dumbbell } from "lucide-react"

type Item = {
    image: string,
    exercise: string,
    description: string,
    sets: number,
    reps: number
}

export default function ItemGymRoutine({ image, exercise, description, sets, reps }: Item) {
    return (
        <div className="w-full col-span-1 bg-[#aad7b8] flex justify-between items-center border-2 rounded-xl py-1 px-2 shadow-[0px_5px_0px_0px_#000000]">
            <div className="flex gap-2 items-center">
                {/* <img src={`./icons/gym/${image}`} className="rounded-xl w-16 h-16 object-cover" alt="" /> */}
                <div className="square-icon-big square-icon-warning">
                    <Dumbbell size={24} />
                </div>
                <div className="leading-5">
                    <p className="font-inter">{exercise}</p>
                    <span className="font-inter font-light text-xs">{description}</span>
                </div>
            </div>
            <span className="font-inter font-semibold text-xl whitespace-nowrap">{sets} x {reps}</span>
        </div>
    )
}
