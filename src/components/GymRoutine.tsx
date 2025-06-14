import ItemGymRoutine from "./ItemGymRoutine"
import { Dumbbell } from "lucide-react"

const items = [
    {
        image: 'press.webp',
        exercise: 'Press en banco inclinado',
        description: '4 series x 8-10 repeticiones',
        sets: '4x8'
    },
    {
        image: 'press.webp',
        exercise: 'Aperturas en peck deck',
        description: '4 series x 10-12 repeticiones',
        sets: '10x12'
    },
    {
        image: 'press.webp',
        exercise: 'Press plano con barra',
        description: '3 series x 8-10 repeticiones',
        sets: '3x10'
    }
]

export default function GymRoutine() {
    return (
        <div>
            <img src="./images/chest-day.png" className="w-full h-auto rounded-2xl" alt="" />
            <span className="flex items-center gap-2 my-4">
                <Dumbbell size={24} />
                <h6 className="font-inter font-semibold">Chest Day</h6>
            </span>
            {
                items.map((element, index) => (
                    <ItemGymRoutine
                        key={index}
                        image={element.image}
                        exercise={element.exercise}
                        description={element.description}
                        sets={element.sets}
                    />
                ))
            }
        </div>
    )
}
