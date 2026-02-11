import MacrosDia from "./MacrosDia"
import CuerpoHoy from "./CuerpoHoy"
import Objetivo from "./Objetivo"
import GymRoutine from "./GymRoutine"
import GymPR from "./GymPR"
import Diet from "./Diet"

export default function Dashboard() {
    return (
        <section>
            <h1 className="font-against text-2xl mt-6">Hola, Aldo!</h1>
            <h4 className="font-brule text-base font-light">Espero que tengas un excelente Lunes</h4>

            <section className="w-full grid grid-cols-3 gap-4 items-stretch mt-4">
                <div>
                    <h4 className="font-inter font-semibold text-lg mb-1">Macros del día</h4>
                    <MacrosDia />
                </div>
                <div>
                    <h4 className="font-inter font-semibold text-lg mb-1">Tu cuerpo hoy</h4>
                    <CuerpoHoy />
                </div>
                <div>
                    <h4 className="font-inter font-semibold text-lg mb-1">Objetivo principal</h4>
                    <Objetivo />
                </div>
            </section>

            <section className="w-full grid grid-cols-3 gap-4 mt-8">
                <div className="col-span-full">
                    <GymRoutine />
                </div>
                <div className="col-span-full">
                    <h4 className="font-inter font-semibold text-lg mb-1">Esto es PR mami 🔥</h4>
                    <GymPR />
                </div>
            </section>

            <section className="w-full mt-8">
                <div className="col-span-2">
                    <h4 className="font-inter font-semibold text-lg mb-1">Hora de comer</h4>
                    <Diet />
                </div>
            </section>
        </section>
    )
}
