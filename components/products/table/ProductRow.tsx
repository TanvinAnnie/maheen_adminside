"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

type Product = {
  _id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  stock: number;
  isActive: boolean;
};

type Props = {
  product: Product;
};

export default function ProductRow({ product }: Props) {
  const router = useRouter();

  async function handleDelete() {
    const ok = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!ok) return;

    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      alert("Product deleted successfully.");

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  }

  return (
    <tr className="border-b border-slate-200 hover:bg-slate-50">
      <td className="px-6 py-4 font-medium">
        {product.name}
      </td>

      <td className="px-6 py-4">
        {product.category}
      </td>

      <td className="px-6 py-4">
        ৳{product.price}
      </td>

      <td className="px-6 py-4">
        {product.stock}
      </td>

      <td className="px-6 py-4">
        {product.isActive ? (
          <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
            Active
          </span>
        ) : (
          <span className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-700">
            Inactive
          </span>
        )}
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Link
            href={`/products/edit/${product._id}`}
            className="rounded-lg bg-blue-100 p-2 text-blue-600 hover:bg-blue-200"
          >
            <Pencil size={18} />
          </Link>

          <button
            onClick={handleDelete}
            className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}