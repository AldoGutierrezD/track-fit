import ItemGymPR from "./ItemGymPR"

const items = [
    {
        image: 'press.webp',
        exercise: 'Press inclinado',
        weight: 100,
        reps: 1,
        date: '10 jun 2025',
        pr: 5
    },
    {
        image: 'press.webp',
        exercise: 'Sentadilla libre',
        weight: 120,
        reps: 2,
        date: '8 jun 2025',
        pr: 10
    },
    {
        image: 'press.webp',
        exercise: 'Press militar',
        weight: 40,
        reps: 3,
        date: '12 jun 2025',
        pr: 10
    }
]

export default function GymPR() {
    return (
        <div className="w-full flex flex-wrap gap-3">
            {
                items.map((element, index) => (
                    <ItemGymPR key={index} image={element.image} exercise={element.exercise} weight={element.weight} reps={element.reps} date={element.date} pr={element.pr} />
                ))
            }
        </div>
    )
}
