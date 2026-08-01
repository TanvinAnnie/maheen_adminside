"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import GeneralInfo, { ProductFormData } from "./GeneralInfo";
import PriceSection from "./PriceSection";
import ImageUploader from "./ImageUploader";
import ProductSettings from "./ProductSettings";
import ProductPreview from "./ProductPreview";

const initialState: ProductFormData = {
  name: "",
  slug: "",
  category: "",
  brand: "",
  description: "",
  price: "",
  discountPrice: "",
  stock: "",
  image: "",
  featured: false,
  isActive: true,
};

export default function ProductForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] =
    useState<ProductFormData>(initialState);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!formData.name) {
      alert("Product name is required.");
      return;
    }

    if (!formData.category) {
      alert("Category is required.");
      return;
    }

    if (!formData.price) {
      alert("Price is required.");
      return;
    }

    if (!formData.image) {
      alert("Please upload a product image.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/products", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          discountPrice: Number(formData.discountPrice),
          stock: Number(formData.stock),
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      alert("Product created successfully.");

      router.push("/products");

      router.refresh();
    } catch (error) {
      console.error(error);

      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-8 xl:grid-cols-3"
    >
      {/* LEFT */}

      <div className="space-y-8 xl:col-span-2">

        <GeneralInfo
          formData={formData}
          setFormData={setFormData}
        />

        <PriceSection
          formData={formData}
          setFormData={setFormData}
        />

        <ImageUploader
          formData={formData}
          setFormData={setFormData}
        />

        <ProductSettings
          formData={formData}
          setFormData={setFormData}
        />

        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            rounded-2xl
            bg-blue-600
            py-4
            text-lg
            font-semibold
            text-white
            transition
            hover:bg-blue-700
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {loading
            ? "Saving Product..."
            : "Save Product"}
        </button>

      </div>

      {/* RIGHT */}

      <div>

        <ProductPreview
          formData={formData}
        />

      </div>

    </form>
  );
}