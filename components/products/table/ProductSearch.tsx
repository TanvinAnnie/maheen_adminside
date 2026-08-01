"use client";

import { Search, X } from "lucide-react";

type ProductSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function ProductSearch({
  value,
  onChange,
}: ProductSearchProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

      {/* Search */}

      <div className="relative w-full max-w-md">

        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          value={value}
          placeholder="Search products..."
          onChange={(e) => onChange(e.target.value)}
          className="
            h-12
            w-full
            rounded-xl
            border
            border-slate-200
            bg-white
            pl-11
            pr-10
            text-sm
            outline-none
            transition
            focus:border-blue-500
            focus:ring-4
            focus:ring-blue-100
          "
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 transition hover:bg-slate-100"
          >
            <X
              size={16}
              className="text-slate-500"
            />
          </button>
        )}

      </div>

      {/* Product Count */}

      <div className="text-sm text-slate-500">
        Search by product name
      </div>

    </div>
  );
}