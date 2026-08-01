"use client";

import { Dispatch, SetStateAction } from "react";
import { ProductFormData } from "./GeneralInfo";

type Props = {
  formData: ProductFormData;
  setFormData: Dispatch<SetStateAction<ProductFormData>>;
};

export default function ProductSettings({
  formData,
  setFormData,
}: Props) {
  const toggle = (
    field: "featured" | "isActive"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-bold text-slate-900">
        Product Settings
      </h2>

      <div className="space-y-6">

        {/* Featured */}

        <div className="flex items-center justify-between">

          <div>

            <h3 className="font-semibold text-slate-900">
              Featured Product
            </h3>

            <p className="text-sm text-slate-500">
              Display this product in the featured section.
            </p>

          </div>

          <button
            type="button"
            onClick={() => toggle("featured")}
            className={`relative h-7 w-14 rounded-full transition ${
              formData.featured
                ? "bg-blue-600"
                : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                formData.featured
                  ? "left-8"
                  : "left-1"
              }`}
            />
          </button>

        </div>

        {/* Active */}

        <div className="flex items-center justify-between">

          <div>

            <h3 className="font-semibold text-slate-900">
              Active Product
            </h3>

            <p className="text-sm text-slate-500">
              Make this product visible to customers.
            </p>

          </div>

          <button
            type="button"
            onClick={() => toggle("isActive")}
            className={`relative h-7 w-14 rounded-full transition ${
              formData.isActive
                ? "bg-green-600"
                : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                formData.isActive
                  ? "left-8"
                  : "left-1"
              }`}
            />
          </button>

        </div>

      </div>

      {/* Summary */}

      <div className="mt-8 rounded-xl bg-slate-50 p-4">

        <h4 className="mb-3 font-semibold text-slate-800">
          Current Status
        </h4>

        <div className="flex flex-wrap gap-3">

          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              formData.featured
                ? "bg-blue-100 text-blue-700"
                : "bg-slate-200 text-slate-600"
            }`}
          >
            {formData.featured
              ? "⭐ Featured"
              : "Not Featured"}
          </span>

          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
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