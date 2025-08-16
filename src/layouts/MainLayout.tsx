import LeftBar from "@/components/LeftBar"
import RightBar from "@/components/RightBar"

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="w-full grid grid-cols-12 grid-rows-1 gap-0">
            <LeftBar />
            <section className="w-full col-span-9" style={{ margin: '15px 5px 15px 100px' }}>
                {children}
            </section>
            <RightBar />
        </main>
    )
}
