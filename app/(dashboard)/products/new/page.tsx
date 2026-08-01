import ProductForm from "@/components/products/form/ProductForm";

export default function NewProductPage() {
  return (
    <div>

      <h1 className="mb-8 text-3xl font-bold text-gray-900">
        Add Product
      </h1>

      <ProductForm />

    </div>
  );
}