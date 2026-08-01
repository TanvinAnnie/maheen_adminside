"use client";

import { useEffect, useMemo, useState } from "react";

import ProductSearch from "./ProductSearch";
import ProductRow, { Product } from "./ProductRow";
import EmptyProducts from "./EmptyProducts";

export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);

      const res = await fetch("/api/products", {
        cache: "no-store",
      });

      const data = await res.json();

      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      setProducts((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.error(error);
      alert("Delete failed.");
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-20 text-center shadow-sm">
        <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

        <h2 className="text-lg font-semibold text-slate-700">
          Loading Products...
        </h2>
      </div>
    );
  }

  if (products.length === 0) {
    return <EmptyProducts />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Search */}

      <div className="border-b border-slate-200 p-6">
        <ProductSearch
          value={search}
          onChange={setSearch}
        />
      </div>

      {/* Table */}

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Product
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Category
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Price
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Stock
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Status
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredProducts.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-16 text-center text-slate-500"
                >
                  No matching products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <ProductRow
                  key={product._id}
                  product={product}
                  onDelete={handleDelete}
                />
              ))
            )}

          </tbody>

        </table>

      </div>

      {/* Footer */}

      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">

        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold">
            {filteredProducts.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold">
            {products.length}
          </span>{" "}
          products
        </p>

        <button
          onClick={fetchProducts}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-slate-100"
        >
          Refresh
        </button>

      </div>

    </div>
  );
}