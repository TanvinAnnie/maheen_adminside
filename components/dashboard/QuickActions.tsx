export default function QuickActions() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">

      <h2 className="mb-6 text-xl font-bold text-gray-900">
        Quick Actions
      </h2>

      <div className="space-y-4">

        <button className="w-full rounded-xl bg-slate-900 py-3 font-semibold text-white transition hover:bg-slate-800">
          + Add Product
        </button>

        <button className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700">
          + Add Category
        </button>

        <button className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700">
          View Orders
        </button>

        <button className="w-full rounded-xl bg-purple-600 py-3 font-semibold text-white transition hover:bg-purple-700">
          Website Settings
        </button>

      </div>

    </div>
  );
}