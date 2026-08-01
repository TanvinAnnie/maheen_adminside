import DashboardCard from "./DashboardCard";

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

      <DashboardCard
        title="Products"
        value="120"
        color="bg-blue-500"
      />

      <DashboardCard
        title="Categories"
        value="15"
        color="bg-green-500"
      />

      <DashboardCard
        title="Orders"
        value="56"
        color="bg-orange-500"
      />

      <DashboardCard
        title="Revenue"
        value="৳25,000"
        color="bg-purple-500"
      />

    </div>
  );
}