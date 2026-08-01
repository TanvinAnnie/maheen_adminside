const activities = [
  {
    title: "New Product Added",
    time: "5 minutes ago",
  },
  {
    title: "Order #1005 Received",
    time: "20 minutes ago",
  },
  {
    title: "Category Updated",
    time: "1 hour ago",
  },
  {
    title: "Settings Changed",
    time: "2 hours ago",
  },
];

export default function RecentActivity() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">

      <h2 className="mb-6 text-xl font-bold text-gray-900">
        Recent Activity
      </h2>

      <div className="space-y-5">

        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-none"
          >
            <div>

              <h3 className="font-semibold text-gray-900">
                {activity.title}
              </h3>

              <p className="text-sm text-gray-500">
                {activity.time}
              </p>

            </div>

            <span className="h-3 w-3 rounded-full bg-green-500"></span>
          </div>
        ))}

      </div>

    </div>
  );
}