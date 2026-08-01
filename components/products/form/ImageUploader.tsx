"use client";

import Image from "next/image";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { ProductFormData } from "./GeneralInfo";

type Props = {
  formData: ProductFormData;
  setFormData: Dispatch<SetStateAction<ProductFormData>>;
};

export default function ImageUploader({
  formData,
  setFormData,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);

  async function uploadImage(file: File) {
    try {
      setUploading(true);

      const body = new FormData();

      body.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body,
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: data.url,
      }));
    } catch (error) {
      console.error(error);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    uploadImage(file);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-bold text-slate-900">
        Product Image
      </h2>

      {formData.image ? (
        <div className="relative">

          <div className="relative h-72 overflow-hidden rounded-xl border">

            <Image
              src={formData.image}
              alt="Preview"
              fill
              className="object-cover"
            />

          </div>

          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                image: "",
              }))
            }
            className="mt-4 rounded-lg bg-red-500 px-5 py-2 font-semibold text-white transition hover:bg-red-600"
          >
            Remove Image
          </button>

        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="
            flex
            h-72
            cursor-pointer
            flex-col
            items-center
            justify-center
            rounded-xl
            border-2
            border-dashed
            border-slate-300
            transition
            hover:border-blue-500
            hover:bg-blue-50
          "
        >
          {uploading ? (
            <>
              <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

              <p className="font-semibold">
                Uploading...
              </p>
            </>
          ) : (
            <>
              <div className="mb-4 text-6xl">
                📤
              </div>

              <h3 className="text-lg font-bold">
                Upload Product Image
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Click here to select an image
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleChange}
      />

    </div>
  );
}