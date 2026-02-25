import ButtonMenu from "./ButtonMenu";
import { Flame, CalendarPlus2, Goal, Dumbbell, Salad } from "lucide-react";
import Link from "next/link";

export default function LeftBar() {
    return (
        <aside className="w-24 h-screen sticky top-0 p-4">
            <nav className="w-full h-full flex flex-col justify-start items-center gap-2 bg-foreground rounded-2xl p-2">
                <Link href="/" className="font-against text-white text-3xl my-3">A</Link>
                <ButtonMenu link="/sesiones" title="Nueva sesión" icon={CalendarPlus2} />
                <ButtonMenu link="/objetivos" title="Establecer objetivos" icon={Goal} />
                <ButtonMenu link="/gym-routine" title="Rutinas del gimnasio" icon={Dumbbell} />
                <ButtonMenu link="/dietas" title="Planes alimenticios" icon={Salad} />
            </nav>
        </aside>
    )
}
