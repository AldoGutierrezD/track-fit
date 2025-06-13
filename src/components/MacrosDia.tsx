export default function MacrosDia() {
    return (
        <div className="flex border-[1px] rounded-2xl h-[90%]">
            <div className="w-2/5 relative bg-green-ground rounded-2xl p-4 text-center">
                <img src="./icons/fire-3d.png" width={150} alt="Icono 3D de fuego" />
                <h5 className="font-inter font-bold text-xl">1080 Kcal</h5>
                <span className="absolute font-inter font-light text-xs left-0 right-0 bottom-5">Calorías por día</span>
            </div>
            <div className="w-3/5 p-4 flex flex-col justify-center">
                <ul>
                    <li className="border-b-[1px] mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full bg-green-500"></div>
                            <h6 className="font-brule font-thin text-sm">Carbohidratos</h6>
                        </div>
                        <p className="font-inter font-semibold my-2">35.5%</p>
                    </li>
                    <li className="border-b-[1px] mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                            <h6 className="font-brule font-thin text-sm">Proteínas</h6>
                        </div>
                        <p className="font-inter font-semibold my-2">45.4%</p>
                    </li>
                    <li>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full bg-red-600"></div>
                            <h6 className="font-brule font-thin text-sm">Grasas</h6>
                        </div>
                        <p className="font-inter font-semibold my-2">9.5%</p>
                    </li>
                </ul>
            </div>
        </div>
    )
}
