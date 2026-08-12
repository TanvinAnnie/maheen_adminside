"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  ImagePlus,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";

type ServiceItem = {
  _id?: string;
  number: string;
  title: string;
  image: string;
  order: number;
  isActive: boolean;
};

type ServiceData = {
  _id?: string;
  eyebrow: string;
  title: string;
  description: string;
  items: ServiceItem[];
  isPublished: boolean;
};

const emptyService: ServiceData = {
  eyebrow: "01 // SERVICES",
  title: "Our Core Services",
  description:
    "We specialize in developing products that meet world-class standards, ensuring every detail is perfect to bring your vision to life.",
  items: [],
  isPublished: true,
};

export default function ServicesNewPage() {
  const [service, setService] =
    useState<ServiceData>(emptyService);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] =
    useState<number | null>(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =====================================================
  // FETCH SERVICES
  // =====================================================

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/services", {
          cache: "no-store",
        });

        const result = await response.json();

        if (response.status === 404) {
          setService(emptyService);
          return;
        }

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to fetch services"
          );
        }

        setService(result.data);
      } catch (err) {
        console.error("Services fetch error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load services"
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchServices();
  }, []);

  // =====================================================
  // UPDATE BASIC FIELD
  // =====================================================

  const updateField = (
    field: keyof ServiceData,
    value: string | boolean
  ) => {
    setService((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // =====================================================
  // ADD SERVICE
  // =====================================================

  const addService = () => {
    setService((previous) => {
      const nextNumber = String(
        previous.items.length + 1
      ).padStart(2, "0");

      const newItem: ServiceItem = {
        number: nextNumber,
        title: "",
        image: "",
        order: previous.items.length + 1,
        isActive: true,
      };

      return {
        ...previous,
        items: [...previous.items, newItem],
      };
    });
  };

  // =====================================================
  // UPDATE SERVICE ITEM
  // =====================================================

  const updateItem = (
    index: number,
    field: keyof ServiceItem,
    value: string | number | boolean
  ) => {
    setService((previous) => {
      const updatedItems = [...previous.items];

      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      };

      return {
        ...previous,
        items: updatedItems,
      };
    });
  };

  // =====================================================
  // DELETE SERVICE
  // =====================================================

  const deleteItem = (index: number) => {
    setService((previous) => {
      const updatedItems = previous.items
        .filter((_, itemIndex) => itemIndex !== index)
        .map((item, itemIndex) => ({
          ...item,
          number: String(itemIndex + 1).padStart(2, "0"),
          order: itemIndex + 1,
        }));

      return {
        ...previous,
        items: updatedItems,
      };
    });
  };

  // =====================================================
  // IMAGE UPLOAD
  // =====================================================

  const handleImageUpload = async (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setUploadingIndex(index);
      setError("");
      setMessage("");

      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Image upload failed"
        );
      }

      const imageUrl =
        result.url ||
        result.data?.url ||
        result.data?.secure_url;

      if (!imageUrl) {
        throw new Error(
          "Upload succeeded but no image URL was returned."
        );
      }

      updateItem(index, "image", imageUrl);

      setMessage("Image uploaded successfully.");
    } catch (err) {
      console.error("Image upload error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Image upload failed"
      );
    } finally {
      setUploadingIndex(null);
      event.target.value = "";
    }
  };

  // =====================================================
  // SAVE
  // =====================================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        eyebrow: service.eyebrow.trim(),
        title: service.title.trim(),
        description: service.description.trim(),

        items: service.items.map((item, index) => ({
          ...(item._id
            ? {
                _id: item._id,
              }
            : {}),

          number: item.number.trim(),
          title: item.title.trim(),
          image: item.image.trim(),
          order: index + 1,
          isActive: item.isActive,
        })),

        isPublished: service.isPublished,
      };

      const method = service._id ? "PUT" : "POST";

      const response = await fetch("/api/services", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to save services"
        );
      }

      setService(result.data);

      setMessage(
        service._id
          ? "Services updated successfully."
          : "Services created successfully."
      );
    } catch (err) {
      console.error("Save services error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save services"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-sm text-gray-500">
          Loading services...
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f4f7fb] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px]">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#111827]">
              Create Services
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your homepage services section.
            </p>
          </div>

          <button
            type="submit"
            form="services-form"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={17} />

            {saving
              ? "Saving..."
              : "Save Services"}
          </button>
        </div>

        {/* ================================================= */}
        {/* SUCCESS MESSAGE */}
        {/* ================================================= */}

        {message && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {/* ================================================= */}
        {/* ERROR MESSAGE */}
        {/* ================================================= */}

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ================================================= */}
        {/* FORM */}
        {/* ================================================= */}

        <form
          id="services-form"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_420px]">

            {/* ================================================= */}
            {/* LEFT */}
            {/* ================================================= */}

            <div className="space-y-6">

              {/* ================================================= */}
              {/* GENERAL INFORMATION */}
              {/* ================================================= */}

              <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    General Information
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Manage the heading and description of the
                    services section.
                  </p>
                </div>

                <div className="space-y-5">

                  {/* SECTION LABEL */}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Section Label
                    </label>

                    <input
                      type="text"
                      value={service.eyebrow}
                      onChange={(event) =>
                        updateField(
                          "eyebrow",
                          event.target.value
                        )
                      }
                      placeholder="01 // SERVICES"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* TITLE */}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Section Title
                    </label>

                    <input
                      type="text"
                      value={service.title}
                      onChange={(event) =>
                        updateField(
                          "title",
                          event.target.value
                        )
                      }
                      placeholder="Our Core Services"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* DESCRIPTION */}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Description
                    </label>

                    <textarea
                      value={service.description}
                      onChange={(event) =>
                        updateField(
                          "description",
                          event.target.value
                        )
                      }
                      rows={5}
                      placeholder="Write your services description..."
                      className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                </div>
              </section>

              {/* ================================================= */}
              {/* SERVICE ITEMS */}
              {/* ================================================= */}

              <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Service Items
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Add and manage the services displayed on
                      your homepage.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addService}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-600 px-4 py-2.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                  >
                    <Plus size={17} />

                    Add Service
                  </button>

                </div>

                {service.items.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-14 text-center">

                    <ImagePlus
                      className="mx-auto mb-3 text-gray-400"
                      size={36}
                    />

                    <h3 className="font-medium text-gray-700">
                      No services added
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Click &quot;Add Service&quot; to create your
                      first service.
                    </p>

                  </div>
                ) : (
                  <div className="space-y-5">

                    {service.items.map(
                      (item, index) => (
                        <div
                          key={
                            item._id ||
                            `new-service-${index}`
                          }
                          className="rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5"
                        >

                          {/* CARD HEADER */}

                          <div className="mb-5 flex items-center justify-between">

                            <div className="flex items-center gap-3">

                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-semibold text-white">
                                {item.number}
                              </div>

                              <div>
                                <h3 className="text-sm font-semibold text-gray-900">
                                  Service{" "}
                                  {item.number}
                                </h3>

                                <p className="text-xs text-gray-500">
                                  Homepage service card
                                </p>
                              </div>

                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                deleteItem(index)
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-500 transition hover:bg-red-100"
                              aria-label="Delete service"
                            >
                              <Trash2 size={16} />
                            </button>

                          </div>

                          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[220px_1fr]">

                            {/* ================================================= */}
                            {/* IMAGE */}
                            {/* ================================================= */}

                            <div>

                              <label className="mb-2 block text-sm font-medium text-gray-700">
                                Service Image
                              </label>

                              <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white">

                                {item.image ? (
                                  <>
                                    <img
                                      src={item.image}
                                      alt={
                                        item.title ||
                                        "Service"
                                      }
                                      className="h-[180px] w-full object-cover"
                                    />

                                    <button
                                      type="button"
                                      onClick={() =>
                                        updateItem(
                                          index,
                                          "image",
                                          ""
                                        )
                                      }
                                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                                      aria-label="Remove image"
                                    >
                                      <X size={15} />
                                    </button>
                                  </>
                                ) : (
                                  <label className="flex h-[180px] cursor-pointer flex-col items-center justify-center text-center">

                                    <Upload
                                      size={30}
                                      className="mb-3 text-gray-400"
                                    />

                                    <span className="text-sm font-medium text-gray-700">
                                      {uploadingIndex ===
                                      index
                                        ? "Uploading..."
                                        : "Upload Image"}
                                    </span>

                                    <span className="mt-1 text-xs text-gray-400">
                                      PNG, JPG, WEBP
                                    </span>

                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      disabled={
                                        uploadingIndex ===
                                        index
                                      }
                                      onChange={(
                                        event
                                      ) =>
                                        handleImageUpload(
                                          event,
                                          index
                                        )
                                      }
                                    />

                                  </label>
                                )}

                              </div>
                            </div>

                            {/* ================================================= */}
                            {/* DETAILS */}
                            {/* ================================================= */}

                            <div className="space-y-5">

                              {/* NUMBER */}

                              <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                  Number
                                </label>

                                <input
                                  type="text"
                                  value={
                                    item.number
                                  }
                                  onChange={(event) =>
                                    updateItem(
                                      index,
                                      "number",
                                      event.target
                                        .value
                                    )
                                  }
                                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                              </div>

                              {/* TITLE */}

                              <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                  Service Title
                                </label>

                                <input
                                  type="text"
                                  value={
                                    item.title
                                  }
                                  onChange={(event) =>
                                    updateItem(
                                      index,
                                      "title",
                                      event.target
                                        .value
                                    )
                                  }
                                  placeholder="Button Manufacturing"
                                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                              </div>

                              {/* ORDER + ACTIVE */}

                              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                <div>
                                  <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Order
                                  </label>

                                  <input
                                    type="number"
                                    min={1}
                                    value={
                                      item.order
                                    }
                                    onChange={(
                                      event
                                    ) =>
                                      updateItem(
                                        index,
                                        "order",
                                        Number(
                                          event
                                            .target
                                            .value
                                        )
                                      )
                                    }
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                  />
                                </div>

                                <div className="flex items-end">

                                  <label className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-3">

                                    <div>
                                      <p className="text-sm font-medium text-gray-700">
                                        Active
                                      </p>

                                      <p className="text-xs text-gray-400">
                                        Show on website
                                      </p>
                                    </div>

                                    <input
                                      type="checkbox"
                                      checked={
                                        item.isActive
                                      }
                                      onChange={(
                                        event
                                      ) =>
                                        updateItem(
                                          index,
                                          "isActive",
                                          event.target
                                            .checked
                                        )
                                      }
                                      className="h-5 w-5 accent-blue-600"
                                    />

                                  </label>

                                </div>

                              </div>

                            </div>

                          </div>

                        </div>
                      )
                    )}

                  </div>
                )}

              </section>

              {/* ================================================= */}
              {/* PUBLISH */}
              {/* ================================================= */}

              <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

                <div className="flex items-center justify-between gap-5">

                  <div>
                    <h2 className="text-base font-semibold text-gray-900">
                      Publish Services
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Control whether this section is visible on
                      the client website.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      updateField(
                        "isPublished",
                        !service.isPublished
                      )
                    }
                    className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                      service.isPublished
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                        service.isPublished
                          ? "left-6"
                          : "left-1"
                      }`}
                    />
                  </button>

                </div>

              </section>

              {/* ================================================= */}
              {/* SAVE */}
              {/* ================================================= */}

              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={18} />

                {saving
                  ? "Saving Services..."
                  : "Save Services"}
              </button>

            </div>

            {/* ================================================= */}
            {/* RIGHT — LIVE PREVIEW */}
            {/* ================================================= */}

            <div className="xl:sticky xl:top-6 xl:self-start">

              <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                <div className="border-b border-gray-200 px-5 py-5">

                  <h2 className="text-lg font-semibold text-gray-900">
                    Live Preview
                  </h2>

                  <p className="mt-1 text-sm text-blue-600">
                    Preview how this section will appear.
                  </p>

                </div>

                <div className="bg-white p-6">

                  <p className="text-[10px] font-medium tracking-[2px] text-[#7890dc]">
                    {service.eyebrow}
                  </p>

                  <h3 className="mt-3 whitespace-pre-line text-3xl font-light leading-tight text-black">
                    {service.title}
                  </h3>

                  <p className="mt-6 text-sm leading-6 text-gray-500">
                    {service.description}
                  </p>

                  <div className="mt-8 space-y-4">

                    {service.items
                      .filter(
                        (item) => item.isActive
                      )
                      .map((item) => (
                        <div
                          key={
                            item._id ||
                            item.number
                          }
                          className="group relative overflow-hidden rounded-2xl"
                        >

                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="h-[170px] w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-[170px] items-center justify-center bg-gray-100">
                              <ImagePlus className="text-gray-400" />
                            </div>
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                          <div className="absolute bottom-4 left-4 right-4">

                            <p className="text-2xl font-semibold text-white">
                              {item.number}
                            </p>

                            <p className="mt-1 text-sm font-medium text-white">
                              {item.title ||
                                "Service Title"}
                            </p>

                          </div>

                        </div>
                      ))}

                  </div>

                </div>

              </section>

            </div>

          </div>
        </form>

      </div>
    </div>
  );
}