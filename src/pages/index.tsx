import LeftBar from "@/components/LeftBar";
import Dashboard from "@/components/Dashboard";
import RightBar from "@/components/RightBar";

export default function Home() {
  return (
    <main className="w-full flex">
      <LeftBar />
      <Dashboard />
      <RightBar />
    </main>
  );
}
