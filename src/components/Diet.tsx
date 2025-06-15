import ItemFood from "./ItemFood"

const diet = [
    {
        color: "bg-pink-300",
        foodType: "Desayuno",
        hour: "08:00 am",
        name: "Chilaquiles Fit",
        images: ['tortillas.jpg', 'huevo.jpg', 'nopales.jpg'],
        carbs: 80,
        protein: 100,
        fat: 12
    },
    {
        color: "bg-lime-200",
        foodType: "Colación",
        hour: "11:00 am",
        name: "Hotcakes de avena",
        images: ['tortillas.jpg', 'huevo.jpg', 'nopales.jpg'],
        carbs: 70,
        protein: 80,
        fat: 6
    },
    {
        color: "bg-amber-200",
        foodType: "Comida",
        hour: "02:00 pm",
        name: "Bisteck con arroz",
        images: ['tortillas.jpg', 'huevo.jpg', 'nopales.jpg'],
        carbs: 80,
        protein: 100,
        fat: 12
    },
    {
        color: "bg-blue-200",
        foodType: "Colación",
        hour: "07:00 pm",
        name: "Molida con pasta",
        images: ['tortillas.jpg', 'huevo.jpg', 'nopales.jpg'],
        carbs: 80,
        protein: 100,
        fat: 12
    },
    {
        color: "bg-purple-200",
        foodType: "Cena",
        hour: "10:00 pm",
        name: "Licuado de proteína",
        images: ['tortillas.jpg', 'huevo.jpg', 'nopales.jpg'],
        carbs: 80,
        protein: 100,
        fat: 12
    }
]

export default function Diet() {
    return (
        <div className="grid grid-cols-3 gap-3">
            {
                diet.map((element, index) => (
                    <ItemFood
                        key={index}
                        color={element.color}
                        foodType={element.foodType}
                        hour={element.hour}
                        name={element.name}
                        images={element.images}
                        carbs={element.carbs}
                        protein={element.protein}
                        fat={element.fat}
                    />
                ))
            }
        </div>
    )
}
