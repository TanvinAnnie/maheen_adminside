"use client";

import Image from "next/image";
import { ProductFormData } from "./GeneralInfo";

type Props = {
  formData: ProductFormData;
};

export default function ProductPreview({
  formData,
}: Props) {
  const finalPrice =
    formData.discountPrice && Number(formData.discountPrice) > 0
      ? formData.discountPrice
      : formData.price;

  return (
    <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

      {/* Header */}

      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-xl font-bold text-slate-900">
          Live Preview
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Preview how this product will appear.
        </p>
      </div>

      {/* Image */}

      <div className="relative aspect-square bg-slate-100">

        {formData.image ? (
          <Image
            src={formData.image}
            alt="Preview"
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-6xl">
            📦
          </div>
        )}

      </div>

      {/* Content */}

      <div className="space-y-5 p-6">

        <div>

          <h3 className="text-2xl font-bold text-slate-900">
            {formData.name || "Product Name"}
          </h3>

          <p className="mt-2 text-slate-500">
            {formData.category || "Category"}
          </p>

        </div>

        {/* Brand */}

        {formData.brand && (
          <div>

            <span className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
              {formData.brand}
            </span>

          </div>
        )}

        {/* Price */}

        <div>

          <div className="flex items-center gap-3">

            <span className="text-3xl font-bold text-blue-600">
              ৳{finalPrice || "0"}
            </span>

            {formData.discountPrice && formData.price && (
              <span className="text-lg text-slate-400 line-through">
                ৳{formData.price}
              </span>
            )}

          </div>

        </div>

        {/* Description */}

        <div>

          <p className="leading-7 text-slate-600">
            {formData.description ||
              "Your product description will appear here."}
          </p>

        </div>

        {/* Stock */}

        <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">

          <span className="font-medium text-slate-600">
            Stock
          </span>

          <span className="font-bold text-slate-900">
            {formData.stock || "0"} pcs
          </span>

        </div>

        {/* Badges */}

        <div className="flex flex-wrap gap-3">

          {formData.featured && (
            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              ⭐ Featured
            </span>
          )}

          <span
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              formData.isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {formData.isActive
              ? "🟢 Active"
              : "🔴 Inactive"}
          </span>

        </div>

      </div>

    </div>
  );
}