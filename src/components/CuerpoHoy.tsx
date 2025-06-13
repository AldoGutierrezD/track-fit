import ItemCuerpoHoy from "./ItemCuerpoHoy"

const items = [
    {
        background: 'bg-[#ffe36d]',
        image: 'weight.webp',
        value: '65 KG',
        title: 'Peso corporal'
    },
    {
        background: 'bg-[#fd9497]',
        image: 'strenght.webp',
        value: '75%',
        title: 'Masa muscular'
    },
    {
        background: 'bg-[#d4bff5]',
        image: 'fat.webp',
        value: '8%',
        title: 'Grasa'
    },
    {
        background: 'bg-[#b3e3ae]',
        image: 'water.webp',
        value: '15%',
        title: 'Agua'
    }
]

export default function CuerpoHoy() {
    return (
        <div className="grid grid-cols-2 gap-4 h-[90%]">
            {
                items.map((element, index) => (
                    <ItemCuerpoHoy key={index} background={element.background} image={element.image} value={element.value} title={element.title} />
                ))
            }
        </div>
    )
}
