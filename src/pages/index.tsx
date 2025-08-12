import LeftBar from "@/components/LeftBar";
import Dashboard from "@/components/Dashboard";
import RightBar from "@/components/RightBar";

export default function Home() {
  return (
    <main className="w-full grid grid-cols-12 grid-rows-1 gap-0">
      <LeftBar />
      <Dashboard />
      <RightBar />
    </main>
  );
}
