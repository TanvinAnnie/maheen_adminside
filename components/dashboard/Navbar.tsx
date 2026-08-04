"use client";

import { Bell, Search } from "lucide-react";

export default function Navbar() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8 shadow-sm">

      {/* Left */}

      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          {today}
        </p>
      </div>

      {/* Center */}

      <div className="relative hidden lg:block">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search products, categories..."
          className="w-[420px] rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 outline-none transition focus:border-blue-500 focus:bg-white"
        />
      </div>

      {/* Right */}

      <div className="flex items-center gap-5">

        <button className="relative rounded-xl border border-slate-200 bg-white p-3 transition hover:bg-slate-100">

          <Bell size={20} />

          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />

        </button>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
            A
          </div>

          <div>

            <h3 className="font-semibold text-slate-900">
              Admin
            </h3>

            <p className="text-sm text-slate-500">
              admin@gmail.com
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}