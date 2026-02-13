type ItemProps = {
    background: string,
    image: string,
    value: string,
    title: string
}

export default function ItemCuerpoHoy({ background, image, value, title }: ItemProps) {
    return (
        <div className={`w-full border-3 rounded-2xl ${background} text-center p-2 flex flex-col items-center shadow-[0px_5px_0px_0px_#000000]`}>
            <img src={`./icons/${image}`} width={50} alt="" />
            <h6 className="font-inter font-semibold text-lg mt-2">{value}</h6>
            <p className="font-inter text-xs">{title}</p>
        </div>
    )
}
