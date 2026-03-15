import UserData from "./UserData"

export default function RightBar() {
    return (
        <aside className="hidden md:block w-80 h-screen sticky top-0 p-4 font-inter">
            <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <UserData />
            </div>
        </aside>
    )
}
