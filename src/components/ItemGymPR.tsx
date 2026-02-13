import { Dumbbell } from "lucide-react"

type Item = {
    image: string,
    exercise: string,
    weight: number,
    reps: number,
    date: string,
    pr: number
}

export default function ItemGymPR({ image, exercise, weight, reps, date, pr }: Item) {

    let currentDate = new Date();
    let difference = currentDate.getTime() - new Date(date).getTime();
    let days = Math.round(difference / (1000 * 3600 * 24));

    return (
        <div className="relative w-full h-full">
            {
                (pr > 0 && days <= 15) &&
                <div className="absolute w-10 h-10 rounded-full bg-green-400 top-0 -right-3 z-10 flex justify-center items-center shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)]">
                    <span className="font-inter text-sm text-white">+{pr}</span>
                </div>
            }

            <div className="relative border-3 bg-green-ground rounded-xl flex flex-col items-center text-center h-full mt-4 px-1 py-2 shadow-[0px_5px_0px_0px_#000000]">
                {/* <img src={`./icons/gym/${image}`} className="w-16 h-16 object-cover rounded-xl" alt="" /> */}
                <div className="square-icon-big square-icon-warning">
                    <Dumbbell size={24} />
                </div>
                <h6 className="font-inter font-semibold mt-2">{weight} KG x {reps}</h6>
                <span className="font-inter font-light text-sm mb-3">{exercise}</span>
                <span className="absolute font-inter font-light italic text-xs bottom-2">{date}</span>
            </div>
        </div>
    )
}
