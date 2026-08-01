import ProductForm from "@/components/products/form/ProductForm";

export default function EditProductPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">
        Edit Product
      </h1>

      <ProductForm />
    </div>
  );
}