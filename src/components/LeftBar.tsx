import ButtonMenu from "./ButtonMenu";
import { Flame } from "lucide-react";
import Link from "next/link";

export default function LeftBar() {
    return (
        <aside className="fixed w-24 h-screen p-4">
            <nav className="w-full h-full flex flex-col justify-start items-center gap-2 bg-foreground rounded-2xl p-2">
                <Link href="/" className="font-against text-white text-3xl my-3">A</Link>
                <ButtonMenu link="/macros-dia" title="Macros del día" icon={Flame} />
            </nav>
        </aside>
    )
}
