import ButtonMenu from "./ButtonMenu";
import { BookUser, CalendarPlus2, Goal, Dumbbell, Salad } from "lucide-react";
import Link from "next/link";
import { ModalUser } from "./ModalUser";
import { useState } from "react";

export default function LeftBar() {

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <aside className="fixed bottom-5 w-full h-auto p-2 z-10 flex justify-center md:block md:w-24 md:h-screen md:sticky md:top-0 md:p-4">
            <nav className="w-fit md:w-full h-full shadow-2xl flex md:flex-col justify-center md:justify-start items-center gap-2 bg-foreground rounded-[35px] md:rounded-2xl py-2 px-6 md:p-2">
                <Link href="/" className="font-against text-white text-3xl my-3">A</Link>
                <div className="bg-slate-800 w-12 h-12 rounded-lg md:hidden">
                    <button type="button" title="Perfil" className="w-full h-full flex justify-center items-center text-yellow-300" onClick={() => setIsModalOpen(true)}>
                        <BookUser />
                    </button>
                </div>
                <ButtonMenu link="/sesiones" title="Nueva sesión" icon={CalendarPlus2} />
                <ButtonMenu link="/objetivos" title="Establecer objetivos" icon={Goal} />
                <ButtonMenu link="/gym-routine" title="Rutinas del gimnasio" icon={Dumbbell} />
                <ButtonMenu link="/dietas" title="Planes alimenticios" icon={Salad} />
                <ModalUser isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            </nav>
        </aside>
    )
}
