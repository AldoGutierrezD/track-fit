import { Weight, Ruler } from "lucide-react";

export default function RightBar() {
    return (
        <aside className="right-bar fixed col-span-2 col-start-11 h-screen p-4 font-inter" style={{ right: '0px' }}>
            <div className="relative w-[245px] h-full rounded-2xl overflow-hidden p-3">

                <div className="absolute inset-0 bg-black/50 z-0"></div>

                <div className="relative z-10 flex flex-col items-center">
                    <img src="images/profile.png" alt="" className="w-20 h-20 rounded-full object-cover bg-background mt-12 mb-4" />
                    <h3 className="font-against text-white-ft text-lg">Aldo Gutiérrez</h3>
                    <h4 className="font-brule text-white-ft text-sm font-light">23 años</h4>

                    <div className="w-full flex gap-2 mt-8">
                        <div className="bg-background w-1/2 h-auto p-1 flex flex-col justify-center items-center rounded-lg">
                            <Weight size={20} />
                            <span className="font-light text-sm">68kg</span>
                        </div>
                        <div className="bg-background w-1/2 h-auto p-1 flex flex-col justify-center items-center rounded-lg">
                            <Ruler size={20} />
                            <span className="font-light text-sm">183cm</span>
                        </div>
                    </div>
                </div>

            </div>
        </aside>
    )
}
