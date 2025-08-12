import ButtonMenu from "./ButtonMenu";
import { Flame } from "lucide-react";

export default function LeftBar() {
    return (
        <aside className="fixed w-24 h-screen p-4">
            <div className="w-full h-full flex flex-col justify-start items-center gap-2 bg-foreground rounded-2xl p-2">
                <a href="/" className="font-against text-white text-3xl my-3">A</a>
                <ButtonMenu link="#" title="Macros del día" icon={Flame} />
            </div>
        </aside>
    )
}
