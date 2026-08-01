"use client";

import { Dispatch, SetStateAction } from "react";

export interface ProductFormData {
  _id?: string;
  name: string;
  slug: string;
  category: string;
  brand: string;
  description: string;
  price: string;
  discountPrice: string;
  stock: string;
  image: string;
  featured: boolean;
  isActive: boolean;
}

type Props = {
  formData: ProductFormData;
  setFormData: Dispatch<SetStateAction<ProductFormData>>;
};

export default function GeneralInfo({
  formData,
  setFormData,
}: Props) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">
        General Information
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Product Name */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Product Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nike Air Max"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {/* Slug */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Slug
          </label>

          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="nike-air-max"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {/* Category */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Category
          </label>

          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Shoes"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {/* Brand */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Brand
          </label>

          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Nike"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Description */}

      <div className="mt-6">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Description
        </label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={6}
          placeholder="Write product description..."
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
      </div>
    </div>
  );
}