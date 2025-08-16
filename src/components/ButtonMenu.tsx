import { SVGProps } from "react"
import Link from "next/link"

type Button = {
    link: string,
    title: string,
    icon: React.ComponentType<SVGProps<SVGSVGElement>>
}

export default function ButtonMenu({ link, title, icon: Icon }: Button) {
    return (
        <div className="bg-slate-800 w-12 h-12 rounded-lg">
            <Link href={link} title={title} className="w-full h-full flex justify-center items-center text-yellow-300">
                <Icon />
            </Link>
        </div>
    )
}
