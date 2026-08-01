import Link from "next/link";
import { PackageOpen, Plus } from "lucide-react";

export default function EmptyProducts() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white py-24">

      {/* Icon */}

      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100">
        <PackageOpen
          size={48}
          className="text-slate-500"
        />
      </div>

      {/* Title */}

      <h2 className="mt-8 text-2xl font-bold text-slate-900">
        No Products Found
      </h2>

      {/* Description */}

      <p className="mt-3 max-w-md text-center text-slate-500">
        Your store doesn't have any products yet.
        Create your first product to start selling.
      </p>

      {/* Button */}

      <Link
        href="/products/new"
        className="
          mt-8
          inline-flex
          items-center
          gap-2
          rounded-xl
          bg-blue-600
          px-6
          py-3
          font-semibold
          text-white
          transition
          hover:bg-blue-700
        "
      >
        <Plus size={18} />

        Add Product
      </Link>

    </div>
  );
}