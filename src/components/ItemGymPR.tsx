type Item = {
    image: string,
    exercise: string,
    weight: number,
    reps: number,
    date: string,
    pr: number
}

export default function ItemGymPR({ image, exercise, weight, reps, date, pr }: Item) {
    return (
        <div className="relative w-32 h-auto">
            <div className="absolute w-8 h-8 rounded-full bg-green-400 top-0 -right-3 z-10 flex justify-center items-center shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)]">
                <span className="font-inter text-sm text-white">+{pr}</span>
            </div>

            <div className="border-[1px] bg-green-ground rounded-xl flex flex-col items-center h-auto mt-4 p-1">
                <img src={`./icons/gym/${image}`} className="w-16 h-16 object-cover rounded-xl" alt="" />
                <span className="font-inter font-light text-sm mt-2">{exercise}</span>
                <h6 className="font-inter font-semibold">{weight} KG x {reps}</h6>
                <span className="font-inter font-light text-xs mt-3">{date}</span>
            </div>
        </div>
    )
}
