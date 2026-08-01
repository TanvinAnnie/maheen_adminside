"use client";

import { Dispatch, SetStateAction } from "react";
import { ProductFormData } from "./GeneralInfo";

type Props = {
  formData: ProductFormData;
  setFormData: Dispatch<SetStateAction<ProductFormData>>;
};

export default function PriceSection({
  formData,
  setFormData,
}: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-bold text-slate-900">
        Pricing & Inventory
      </h2>

      <div className="grid gap-5 md:grid-cols-3">
        {/* Price */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Price
          </label>

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="3500"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {/* Discount */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Discount Price
          </label>

          <input
            type="number"
            name="discountPrice"
            value={formData.discountPrice}
            onChange={handleChange}
            placeholder="3000"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {/* Stock */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Stock
          </label>

          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="20"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Preview */}

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-blue-50 p-4">
          <p className="text-sm text-slate-500">Price</p>

          <h3 className="mt-2 text-2xl font-bold text-blue-600">
            ৳{formData.price || "0"}
          </h3>
        </div>

        <div className="rounded-xl bg-green-50 p-4">
          <p className="text-sm text-slate-500">Discount</p>

          <h3 className="mt-2 text-2xl font-bold text-green-600">
            ৳{formData.discountPrice || "0"}
          </h3>
        </div>

        <div className="rounded-xl bg-orange-50 p-4">
          <p className="text-sm text-slate-500">Stock</p>

          <h3 className="mt-2 text-2xl font-bold text-orange-600">
            {formData.stock || "0"} pcs
          </h3>
        </div>
      </div>
    </div>
  );
}