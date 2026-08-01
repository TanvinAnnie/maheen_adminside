"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

type ProductActionsProps = {
  productId: string;
  onDelete: (id: string) => void;
};

export default function ProductActions({
  productId,
  onDelete,
}: ProductActionsProps) {
  return (
    <div className="flex items-center justify-center gap-2">

      {/* Edit */}

      <Link
        href={`/products/edit/${productId}`}
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-lg
          bg-blue-50
          text-blue-600
          transition-all
          duration-200
          hover:scale-105
          hover:bg-blue-600
          hover:text-white
        "
      >
        <Pencil size={18} />
      </Link>

      {/* Delete */}

      <button
        type="button"
        onClick={() => onDelete(productId)}
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-lg
          bg-red-50
          text-red-600
          transition-all
          duration-200
          hover:scale-105
          hover:bg-red-600
          hover:text-white
        "
      >
        <Trash2 size={18} />
      </button>

    </div>
  );
}