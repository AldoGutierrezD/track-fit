import LeftBar from "@/components/LeftBar"
import RightBar from "@/components/RightBar"

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="min-h-screen flex">
            <LeftBar />
            <section>
                {children}
            </section>
            <RightBar />
        </main>
    )
}
