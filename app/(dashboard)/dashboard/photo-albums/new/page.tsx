"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Save,
  Upload,
  Image as ImageIcon,
  Eye,
  EyeOff,
  GripVertical,
} from "lucide-react";

type PhotoAlbumItem = {
  _id?: string;
  title: string;
  subtitle: string;
  image: string;
  order: number;
  isActive: boolean;
};

type PhotoAlbumData = {
  _id?: string;
  eyebrow: string;
  title: string;
  highlightedTitle: string;
  secondTitle: string;
  items: PhotoAlbumItem[];
  isPublished: boolean;
};

const emptyItem = (): PhotoAlbumItem => ({
  title: "",
  subtitle: "",
  image: "",
  order: 1,
  isActive: true,
});

export default function PhotoAlbumsNewPage() {
  const [data, setData] = useState<PhotoAlbumData>({
    eyebrow: "02 // PHOTO ALBUMS",
    title: "Collection of photos",
    highlightedTitle: "All of Our",
    secondTitle: "Best Works",
    items: [],
    isPublished: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =====================================================
  // LOAD PHOTO ALBUMS
  // =====================================================

  useEffect(() => {
    const loadPhotoAlbums = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/photo-albums", {
          cache: "no-store",
        });

        const result = await response.json();

        /*
         * If there is no Photo Albums document yet,
         * keep the default empty form.
         */
        if (response.status === 404) {
          setData({
            eyebrow: "02 // PHOTO ALBUMS",
            title: "Collection of photos",
            highlightedTitle: "All of Our",
            secondTitle: "Best Works",
            items: [],
            isPublished: true,
          });

          return;
        }

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to fetch photo albums"
          );
        }

        if (result.data) {
          setData({
            _id: result.data._id,

            eyebrow:
              result.data.eyebrow ||
              "02 // PHOTO ALBUMS",

            title:
              result.data.title ||
              "Collection of photos",

            highlightedTitle:
              result.data.highlightedTitle ||
              "All of Our",

            secondTitle:
              result.data.secondTitle ||
              "Best Works",

            items: Array.isArray(result.data.items)
              ? result.data.items
              : [],

            isPublished:
              typeof result.data.isPublished === "boolean"
                ? result.data.isPublished
                : true,
          });
        }
      } catch (err) {
        console.error(
          "Photo Albums fetch error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load photo albums"
        );
      } finally {
        setLoading(false);
      }
    };

    void loadPhotoAlbums();
  }, []);

  // =====================================================
  // UPDATE GENERAL FIELD
  // =====================================================

  const updateField = (
    field: keyof PhotoAlbumData,
    value: string | boolean
  ) => {
    setData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // =====================================================
  // UPDATE PHOTO ITEM
  // =====================================================

  const updateItem = (
    index: number,
    field: keyof PhotoAlbumItem,
    value: string | number | boolean
  ) => {
    setData((previous) => ({
      ...previous,

      items: previous.items.map(
        (item, itemIndex) =>
          itemIndex === index
            ? {
                ...item,
                [field]: value,
              }
            : item
      ),
    }));
  };

  // =====================================================
  // ADD PHOTO
  // =====================================================

  const addItem = () => {
    setData((previous) => ({
      ...previous,

      items: [
        ...previous.items,

        {
          ...emptyItem(),
          order: previous.items.length + 1,
        },
      ],
    }));
  };

  // =====================================================
  // REMOVE PHOTO
  // =====================================================

  const removeItem = (index: number) => {
    setData((previous) => ({
      ...previous,

      items: previous.items
        .filter(
          (_, itemIndex) =>
            itemIndex !== index
        )
        .map((item, itemIndex) => ({
          ...item,
          order: itemIndex + 1,
        })),
    }));
  };

  // =====================================================
  // IMAGE UPLOAD
  // =====================================================

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(
        "/api/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to upload image"
        );
      }

      const imageUrl =
        result.url ||
        result.data?.url ||
        result.data?.secure_url;

      if (!imageUrl) {
        throw new Error(
          "Image URL was not returned by the upload API."
        );
      }

      updateItem(
        index,
        "image",
        imageUrl
      );

      setMessage(
        "Image uploaded successfully."
      );
    } catch (err) {
      console.error(
        "Photo image upload error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to upload image"
      );
    } finally {
      event.target.value = "";
    }
  };

  // =====================================================
  // SAVE PHOTO ALBUMS
  // =====================================================

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const payload = {
        eyebrow: data.eyebrow.trim(),

        title: data.title.trim(),

        highlightedTitle:
          data.highlightedTitle.trim(),

        secondTitle:
          data.secondTitle.trim(),

        items: data.items.map(
          (item, index) => ({
            ...(item._id
              ? {
                  _id: item._id,
                }
              : {}),

            title: item.title.trim(),

            subtitle:
              item.subtitle.trim(),

            image: item.image.trim(),

            order: index + 1,

            isActive:
              item.isActive,
          })
        ),

        isPublished:
          data.isPublished,
      };

      /*
       * If an existing document exists,
       * update it.
       *
       * If no document exists, try POST first.
       */
      const method = data._id
        ? "PUT"
        : "POST";

      const response = await fetch(
        "/api/photo-albums",
        {
          method,

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            payload
          ),
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to save photo albums"
        );
      }

      if (result.data) {
        setData({
          _id: result.data._id,

          eyebrow:
            result.data.eyebrow ||
            payload.eyebrow,

          title:
            result.data.title ||
            payload.title,

          highlightedTitle:
            result.data
              .highlightedTitle ||
            payload.highlightedTitle,

          secondTitle:
            result.data.secondTitle ||
            payload.secondTitle,

          items:
            Array.isArray(
              result.data.items
            )
              ? result.data.items
              : payload.items,

          isPublished:
            typeof result.data
              .isPublished ===
            "boolean"
              ? result.data
                  .isPublished
              : payload.isPublished,
        });
      }

      setMessage(
        data._id
          ? "Photo albums updated successfully."
          : "Photo albums created successfully."
      );

      window.setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      console.error(
        "Photo Albums save error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save photo albums"
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
      <main className="min-h-screen bg-slate-100 p-4 sm:p-6">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse space-y-6">

            <div className="h-10 w-64 rounded-lg bg-slate-200" />

            <div className="h-32 rounded-xl bg-white" />

            <div className="h-96 rounded-xl bg-white" />

          </div>
        </div>
      </main>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {data._id
                ? "Edit Photo Albums"
                : "Add Photo Albums"}
            </h1>

            <p className="mt-1 text-sm text-blue-600">
              Manage your homepage photo albums section.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={17} />

            {saving
              ? "Saving..."
              : data._id
              ? "Update Photo Albums"
              : "Save Photo Albums"}
          </button>

        </div>

        {/* ================================================= */}
        {/* SUCCESS */}
        {/* ================================================= */}

        {message && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {message}
          </div>
        )}

        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* ================================================= */}
        {/* MAIN GRID */}
        {/* ================================================= */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">

          {/* ================================================= */}
          {/* LEFT */}
          {/* ================================================= */}

          <div className="space-y-6">

            {/* ================================================= */}
            {/* GENERAL INFORMATION */}
            {/* ================================================= */}

            <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-200 p-5">

                <h2 className="text-lg font-bold text-slate-900">
                  General Information
                </h2>

                <p className="mt-1 text-sm text-blue-600">
                  Manage the heading of the photo albums
                  section.
                </p>

              </div>

              <div className="space-y-5 p-5">

                {/* SECTION LABEL */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-blue-600">
                    Section Label
                  </label>

                  <input
                    type="text"
                    value={data.eyebrow}
                    onChange={(event) =>
                      updateField(
                        "eyebrow",
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="02 // PHOTO ALBUMS"
                  />
                </div>

                {/* MAIN TITLE */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-blue-600">
                    Main Title
                  </label>

                  <input
                    type="text"
                    value={data.title}
                    onChange={(event) =>
                      updateField(
                        "title",
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="Collection of photos"
                  />
                </div>

                {/* HIGHLIGHTED TITLE */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-blue-600">
                    Highlighted Title
                  </label>

                  <input
                    type="text"
                    value={
                      data.highlightedTitle
                    }
                    onChange={(event) =>
                      updateField(
                        "highlightedTitle",
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="All of Our"
                  />
                </div>

                {/* SECOND TITLE */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-blue-600">
                    Second Title
                  </label>

                  <input
                    type="text"
                    value={
                      data.secondTitle
                    }
                    onChange={(event) =>
                      updateField(
                        "secondTitle",
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="Best Works"
                  />
                </div>

              </div>
            </section>

            {/* ================================================= */}
            {/* PHOTO ITEMS */}
            {/* ================================================= */}

            <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

              <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Photo Album Items
                  </h2>

                  <p className="mt-1 text-sm text-blue-600">
                    Add and manage the photos displayed on
                    your homepage.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addItem}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-500 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                >
                  <Plus size={17} />

                  Add Photo
                </button>

              </div>

              <div className="space-y-5 p-5">

                {data.items.length === 0 ? (

                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">

                    <ImageIcon
                      className="mx-auto mb-3 text-slate-400"
                      size={40}
                    />

                    <h3 className="font-semibold text-slate-700">
                      No photos added
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Click &quot;Add Photo&quot; to create your
                      first album item.
                    </p>

                  </div>

                ) : (

                  data.items.map(
                    (item, index) => (

                      <div
                        key={
                          item._id ??
                          `new-${index}`
                        }
                        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                      >

                        {/* ITEM HEADER */}

                        <div className="mb-4 flex items-center justify-between">

                          <div className="flex items-center gap-3">

                            <GripVertical
                              size={18}
                              className="text-slate-400"
                            />

                            <div>
                              <h3 className="font-semibold text-slate-900">
                                Photo{" "}
                                {String(
                                  index + 1
                                ).padStart(
                                  2,
                                  "0"
                                )}
                              </h3>

                              <p className="text-xs text-slate-500">
                                Order{" "}
                                {index + 1}
                              </p>
                            </div>

                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeItem(
                                index
                              )
                            }
                            className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                            title="Delete photo"
                          >
                            <Trash2
                              size={17}
                            />
                          </button>

                        </div>

                        {/* ITEM GRID */}

                        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">

                          {/* ================================================= */}
                          {/* IMAGE */}
                          {/* ================================================= */}

                          <div>

                            <label className="mb-2 block text-sm font-medium text-blue-600">
                              Photo
                            </label>

                            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

                              {item.image ? (

                                <div className="relative">

                                  <img
                                    src={
                                      item.image
                                    }
                                    alt={
                                      item.title ||
                                      "Album photo"
                                    }
                                    className="h-48 w-full object-cover"
                                  />

                                  <div className="absolute bottom-2 left-2">

                                    <span className="inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white">

                                      <ImageIcon
                                        size={12}
                                      />

                                      Uploaded

                                    </span>

                                  </div>

                                </div>

                              ) : (

                                <label className="flex h-48 cursor-pointer flex-col items-center justify-center text-center text-slate-400">

                                  <Upload
                                    size={30}
                                  />

                                  <span className="mt-2 text-xs">
                                    Upload image
                                  </span>

                                  <span className="mt-1 text-[11px] text-slate-400">
                                    PNG, JPG, WEBP
                                  </span>

                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
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

                            {/* IMAGE URL */}

                            <input
                              type="url"
                              value={
                                item.image
                              }
                              onChange={(
                                event
                              ) =>
                                updateItem(
                                  index,
                                  "image",
                                  event.target
                                    .value
                                )
                              }
                              className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-500"
                              placeholder="Cloudinary image URL"
                            />

                          </div>

                          {/* ================================================= */}
                          {/* DETAILS */}
                          {/* ================================================= */}

                          <div className="space-y-4">

                            {/* TITLE */}

                            <div>

                              <label className="mb-2 block text-sm font-medium text-blue-600">
                                Title
                              </label>

                              <input
                                type="text"
                                value={
                                  item.title
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateItem(
                                    index,
                                    "title",
                                    event.target
                                      .value
                                  )
                                }
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                placeholder="Customize Button"
                              />

                            </div>

                            {/* SUBTITLE */}

                            <div>

                              <label className="mb-2 block text-sm font-medium text-blue-600">
                                Subtitle
                              </label>

                              <input
                                type="text"
                                value={
                                  item.subtitle
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateItem(
                                    index,
                                    "subtitle",
                                    event.target
                                      .value
                                  )
                                }
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                placeholder="BY MAHEEN ACCESSORIES LIMITED."
                              />

                            </div>

                            {/* ORDER + ACTIVE */}

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                              <div>

                                <label className="mb-2 block text-sm font-medium text-blue-600">
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
                                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />

                              </div>

                              <div className="flex items-end">

                                <button
                                  type="button"
                                  onClick={() =>
                                    updateItem(
                                      index,
                                      "isActive",
                                      !item.isActive
                                    )
                                  }
                                  className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition ${
                                    item.isActive
                                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                                      : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                                  }`}
                                >

                                  {item.isActive ? (
                                    <>
                                      <Eye
                                        size={
                                          17
                                        }
                                      />
                                      Active
                                    </>
                                  ) : (
                                    <>
                                      <EyeOff
                                        size={
                                          17
                                        }
                                      />
                                      Inactive
                                    </>
                                  )}

                                </button>

                              </div>

                            </div>

                          </div>

                        </div>

                      </div>

                    )
                  )

                )}

              </div>

            </section>

            {/* ================================================= */}
            {/* SECTION SETTINGS */}
            {/* ================================================= */}

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between gap-4">

                <div>

                  <h2 className="font-bold text-slate-900">
                    Section Settings
                  </h2>

                  <p className="mt-1 text-sm text-blue-600">
                    Control whether the photo albums section
                    is visible to customers.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    updateField(
                      "isPublished",
                      !data.isPublished
                    )
                  }
                  className={`relative h-7 w-14 shrink-0 rounded-full transition ${
                    data.isPublished
                      ? "bg-green-500"
                      : "bg-slate-300"
                  }`}
                  aria-label="Toggle published status"
                >

                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                      data.isPublished
                        ? "left-8"
                        : "left-1"
                    }`}
                  />

                </button>

              </div>

              <div className="mt-4 rounded-lg bg-slate-50 px-4 py-3">

                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                    data.isPublished
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >

                  <span
                    className={`h-2 w-2 rounded-full ${
                      data.isPublished
                        ? "bg-green-500"
                        : "bg-slate-400"
                    }`}
                  />

                  {data.isPublished
                    ? "Published"
                    : "Hidden"}

                </span>

              </div>

            </section>

            {/* ================================================= */}
            {/* SAVE BUTTON */}
            {/* ================================================= */}

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >

              <Save size={18} />

              {saving
                ? "Saving Photo Albums..."
                : data._id
                ? "Update Photo Albums"
                : "Save Photo Albums"}

            </button>

          </div>

          {/* ================================================= */}
          {/* RIGHT — LIVE PREVIEW */}
          {/* ================================================= */}

          <aside className="h-fit xl:sticky xl:top-6">

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-200 p-5">

                <h2 className="text-lg font-bold text-slate-900">
                  Live Preview
                </h2>

                <p className="mt-1 text-sm text-blue-600">
                  Preview how this section will appear.
                </p>

              </div>

              <div className="bg-white p-5">

                {/* PREVIEW HEADING */}

                <div className="text-center">

                  <p className="text-[9px] font-semibold tracking-[0.18em] text-blue-500">
                    {data.eyebrow}
                  </p>

                  <h3 className="mt-4 text-3xl font-medium leading-tight text-slate-900">
                    {data.title}
                  </h3>

                  <p className="mt-1 text-2xl italic text-slate-900">
                    {data.highlightedTitle}
                  </p>

                  <p className="text-2xl font-medium text-slate-900">
                    {data.secondTitle}
                  </p>

                </div>

                {/* PREVIEW ITEMS */}

                <div className="mt-6 space-y-4">

                  {data.items
                    .filter(
                      (item) =>
                        item.isActive
                    )
                    .slice(0, 3)
                    .map(
                      (
                        item,
                        index
                      ) => (

                        <div
                          key={
                            item._id ??
                            `preview-${index}`
                          }
                          className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                        >

                          <div className="aspect-[4/3] bg-slate-100">

                            {item.image ? (

                              <img
                                src={
                                  item.image
                                }
                                alt={
                                  item.title ||
                                  "Preview"
                                }
                                className="h-full w-full object-cover"
                              />

                            ) : (

                              <div className="flex h-full items-center justify-center">

                                <ImageIcon
                                  size={34}
                                  className="text-slate-300"
                                />

                              </div>

                            )}

                          </div>

                          <div className="p-4">

                            <p className="text-sm font-semibold text-slate-900">
                              {item.title ||
                                "Photo title"}
                            </p>

                            <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                              {item.subtitle ||
                                "Album subtitle"}
                            </p>

                          </div>

                        </div>

                      )
                    )}

                  {/* EMPTY PREVIEW */}

                  {data.items.filter(
                    (item) =>
                      item.isActive
                  ).length === 0 && (

                    <div className="rounded-xl border border-dashed border-slate-300 px-5 py-10 text-center">

                      <ImageIcon
                        className="mx-auto mb-2 text-slate-300"
                        size={32}
                      />

                      <p className="text-sm text-slate-500">
                        Add active photos to
                        see the preview.
                      </p>

                    </div>

                  )}

                </div>

              </div>

            </section>

          </aside>

        </div>

      </div>
    </main>
  );
}