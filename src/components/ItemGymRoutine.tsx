type Item = {
    image: string,
    exercise: string,
    description: string,
    sets: string
}

export default function ItemGymRoutine({ image, exercise, description, sets }: Item) {
    return (
        <div className="bg-amber-200 flex justify-between items-center border-[1px] rounded-xl my-2 py-1 px-2">
            <div className="flex gap-2 items-center">
                <img src={`./icons/gym/${image}`} className="rounded-xl w-16 h-16 object-cover" alt="" />
                <div className="leading-5">
                    <p className="font-inter">{exercise}</p>
                    <span className="font-inter font-light text-xs">{description}</span>
                </div>
            </div>
            <span className="font-inter font-semibold text-xl">{sets}</span>
        </div>
    )
}
