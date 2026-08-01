import Link from "next/link";
import { Plus } from "lucide-react";

import { connectToDB } from "@/lib/connectToDB";
import Product from "@/lib/models/Product";

import ProductTable from "@/components/products/table/ProductTable";

export default async function ProductsPage() {
  await connectToDB();

  const products = await Product.find({})
    .sort({ createdAt: -1 })
    .lean();

  const serializedProducts = products.map((product) => ({
    _id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    category: product.category,
    brand: product.brand,
    image: product.image,
    price: product.price,
    discountPrice: product.discountPrice,
    stock: product.stock,
    featured: product.featured,
    isActive: product.isActive,
  }));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Products
          </h1>

          <p className="mt-2 text-slate-500">
            Manage all your store products.
          </p>
        </div>

        <Link
          href="/products/new"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      <ProductTable products={serializedProducts} />
    </div>
  );
}