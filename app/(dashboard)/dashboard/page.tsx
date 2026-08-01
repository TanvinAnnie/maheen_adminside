import StatsGrid from "@/components/dashboard/StatsGrid";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions";

export default function DashboardPage() {
  return (
    <div>

      <h1 className="mb-8 text-3xl font-bold text-gray-900">
        Dashboard
      </h1>

      <StatsGrid />

      <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-3">

        <div className="xl:col-span-2">
          <RecentActivity />
        </div>

        <QuickActions />

      </div>

    </div>
  );
}