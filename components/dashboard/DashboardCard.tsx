type DashboardCardProps = {
  title: string;
  value: string | number;
  color: string;
};

export default function DashboardCard({
  title,
  value,
  color,
}: DashboardCardProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 transition hover:shadow-lg">

      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${color}`}
      >
        <div className="h-5 w-5 rounded-full bg-white" />
      </div>

      <p className="text-sm font-medium text-gray-500">
        {title}
      </p>

      <h2 className="mt-2 text-3xl font-bold text-gray-900">
        {value}
      </h2>

    </div>
  );
}