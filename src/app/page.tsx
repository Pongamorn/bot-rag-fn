import Sidebar from "../components/Sidebar";
import DashboardTable from "../components/DashboardTable";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <DashboardTable />
      </main>
    </div>
  );
}
