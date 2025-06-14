export default function Objetivo() {
    return (
        <div className="h-[90%] border-[1px] rounded-2xl flex justify-center items-center bg-slate-950">
            <div className="relative size-50">
                <svg className="rotate-[135deg] size-full" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-slate-300 dark:text-slate-300" stroke-width="1" stroke-dasharray="75 100" stroke-linecap="round"></circle>

                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-stone-100 dark:text-stone-100" stroke-width="2" stroke-dasharray="56.25 100" stroke-linecap="round"></circle>
                </svg>

                <div className="absolute top-1/2 start-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <span className="font-against text-5xl font-bold text-stone-100 dark:text-stone-100">75%</span>
                    <span className="font-inter font-light text-stone-100 dark:text-stone-100 block">68KG / 80KG</span>
                </div>
            </div>
        </div>
    )
}
