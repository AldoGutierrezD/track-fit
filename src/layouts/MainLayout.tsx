import LeftBar from "@/components/LeftBar"
import RightBar from "@/components/RightBar"

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="min-h-screen flex">
            <LeftBar />
            <section className="flex-1 p-4">
                {children}
            </section>
            <RightBar />
        </main>
    )
}
