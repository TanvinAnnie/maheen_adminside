"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  Image as ImageIcon,
  ArrowUpRight,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

const toast = {
  success: (message: string) => {
    if (typeof window !== "undefined") {
      window.alert(message);
    } else {
      console.log("Success:", message);
    }
  },
  error: (message: string) => {
    if (typeof window !== "undefined") {
      window.alert(message);
    } else {
      console.error("Error:", message);
    }
  },
};

/* =========================================================
   TYPES
========================================================= */

type SocialLink = {
  platform: "facebook" | "instagram" | "linkedin";
  url: string;
  enabled: boolean;
};

type HeroSlide = {
  eyebrow: string;
  title: string;
  description: string;

  backgroundImage: string;

  primaryButton: {
    text: string;
    link: string;
    enabled: boolean;
  };

  secondaryButton: {
    text: string;
    link: string;
    enabled: boolean;
  };

  socialLinks: SocialLink[];

  order: number;
  isActive: boolean;
};

/* =========================================================
   DEFAULT SLIDE
========================================================= */

const createDefaultSlide = (
  order: number
): HeroSlide => ({
  eyebrow:
    "YOUR TRUSTED PARTNER IN QUALITY ACCESSORIES",

  title:
    "Innovative Solutions for Every Need",

  description:
    "At Maheen Accessories Ltd, we provide top-notch products that meet world-class standards. Our advanced infrastructure and expert team cater to diverse customer needs.",

  backgroundImage: "",

  primaryButton: {
    text: "Book A Call",
    link: "/contact",
    enabled: true,
  },

  secondaryButton: {
    text: "Explore Now",
    link: "/products",
    enabled: true,
  },

  socialLinks: [
    {
      platform: "facebook",
      url: "",
      enabled: true,
    },
    {
      platform: "instagram",
      url: "",
      enabled: true,
    },
    {
      platform: "linkedin",
      url: "",
      enabled: true,
    },
  ],

  order,

  isActive: true,
});

/* =========================================================
   PAGE
========================================================= */

export default function NewHeroPage() {
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement | null>(
    null
  );

  const [slide, setSlide] = useState<HeroSlide>(
    createDefaultSlide(1)
  );

  const [isPublished, setIsPublished] =
    useState(true);

  const [uploading, setUploading] = useState(false);

  const [saving, setSaving] = useState(false);

  /* =======================================================
     UPDATE SLIDE
  ======================================================= */

  const updateSlide = (
    field: keyof HeroSlide,
    value: unknown
  ) => {
    setSlide((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  /* =======================================================
     UPDATE PRIMARY BUTTON
  ======================================================= */

  const updatePrimaryButton = (
    field: "text" | "link" | "enabled",
    value: string | boolean
  ) => {
    setSlide((previous) => ({
      ...previous,

      primaryButton: {
        ...previous.primaryButton,
        [field]: value,
      },
    }));
  };

  /* =======================================================
     UPDATE SECONDARY BUTTON
  ======================================================= */

  const updateSecondaryButton = (
    field: "text" | "link" | "enabled",
    value: string | boolean
  ) => {
    setSlide((previous) => ({
      ...previous,

      secondaryButton: {
        ...previous.secondaryButton,
        [field]: value,
      },
    }));
  };

  /* =======================================================
     UPDATE SOCIAL LINK
  ======================================================= */

  const updateSocialLink = (
    index: number,
    field: keyof SocialLink,
    value: string | boolean
  ) => {
    setSlide((previous) => ({
      ...previous,

      socialLinks: previous.socialLinks.map(
        (social, socialIndex) =>
          socialIndex === index
            ? {
                ...social,
                [field]: value,
              }
            : social
      ),
    }));
  };

  /* =======================================================
     IMAGE UPLOAD
  ======================================================= */

  const handleImageUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploading(true);

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
            "Image upload failed"
        );
      }

      /*
       * Supports common response formats:
       *
       * result.url
       * result.data.url
       */

      const imageUrl =
        result.url ||
        result.data?.url ||
        result.data?.secure_url;

      if (!imageUrl) {
        throw new Error(
          "Uploaded image URL was not returned"
        );
      }

      updateSlide(
        "backgroundImage",
        imageUrl
      );

      toast.success(
        "Hero image uploaded successfully"
      );
    } catch (error) {
      console.error(
        "Hero image upload error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Image upload failed"
      );
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  /* =======================================================
     SAVE HERO
  ======================================================= */

  const handleSave = async () => {
    if (!slide.title.trim()) {
      toast.error("Hero title is required");
      return;
    }

    if (!slide.description.trim()) {
      toast.error(
        "Hero description is required"
      );
      return;
    }

    if (!slide.backgroundImage) {
      toast.error(
        "Please upload a hero image"
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        slides: [
          {
            ...slide,
            order: 1,
          },
        ],

        isPublished,
      };

      const response = await fetch(
        "/api/hero",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to create hero"
        );
      }

      toast.success(
        "Hero created successfully"
      );

      router.push("/dashboard/hero");

      router.refresh();
    } catch (error) {
      console.error(
        "Create hero error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create hero"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-4 sm:p-6">
      {/* =====================================================
          PAGE TITLE
      ===================================================== */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111827] sm:text-3xl">
          Add Hero
        </h1>

        <p className="mt-1 text-sm text-[#4f46e5]">
          Create and manage your website hero
          section.
        </p>
      </div>

      {/* =====================================================
          MAIN GRID
      ===================================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_440px]">
        {/* ===================================================
            LEFT SIDE
        =================================================== */}

        <div className="space-y-6">
          {/* =================================================
              HERO INFORMATION
          ================================================= */}

          <section className="rounded-2xl border border-[#dce4ef] bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-bold text-[#111827]">
              Hero Information
            </h2>

            <p className="mt-1 text-sm text-[#4f46e5]">
              Add the main content of your hero
              section.
            </p>

            {/* EYEBROW */}

            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-[#111827]">
                Eyebrow
              </label>

              <input
                type="text"
                value={slide.eyebrow}
                onChange={(event) =>
                  updateSlide(
                    "eyebrow",
                    event.target.value
                  )
                }
                placeholder="YOUR TRUSTED PARTNER..."
                className="h-12 w-full rounded-xl border border-[#cbd8e8] px-4 text-sm outline-none transition focus:border-[#2161f5] focus:ring-2 focus:ring-[#2161f5]/10"
              />
            </div>

            {/* TITLE */}

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-[#111827]">
                Title
              </label>

              <input
                type="text"
                value={slide.title}
                onChange={(event) =>
                  updateSlide(
                    "title",
                    event.target.value
                  )
                }
                placeholder="Innovative Solutions for Every Need"
                className="h-12 w-full rounded-xl border border-[#cbd8e8] px-4 text-sm outline-none transition focus:border-[#2161f5] focus:ring-2 focus:ring-[#2161f5]/10"
              />
            </div>

            {/* DESCRIPTION */}

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-[#111827]">
                Description
              </label>

              <textarea
                value={slide.description}
                onChange={(event) =>
                  updateSlide(
                    "description",
                    event.target.value
                  )
                }
                rows={5}
                placeholder="Write hero description..."
                className="w-full resize-none rounded-xl border border-[#cbd8e8] px-4 py-3 text-sm outline-none transition focus:border-[#2161f5] focus:ring-2 focus:ring-[#2161f5]/10"
              />
            </div>
          </section>

          {/* =================================================
              HERO IMAGE
          ================================================= */}

          <section className="rounded-2xl border border-[#dce4ef] bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-bold text-[#111827]">
              Hero Image
            </h2>

            <p className="mt-1 text-sm text-[#4f46e5]">
              Upload the background image used in
              the hero.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {slide.backgroundImage ? (
              <div className="relative mt-6 overflow-hidden rounded-xl border border-[#d5deeb]">
                <img
                  src={
                    slide.backgroundImage
                  }
                  alt="Hero preview"
                  className="h-[300px] w-full object-cover"
                />

                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/60 px-4 py-3">
                  <p className="text-sm text-white">
                    Image uploaded
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="rounded-lg bg-white px-4 py-2 text-xs font-medium text-[#111827]"
                  >
                    Change Image
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                disabled={uploading}
                className="mt-6 flex min-h-[260px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#b9c9dc] bg-[#fafcff] transition hover:border-[#2161f5] hover:bg-[#f5f8ff]"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-10 w-10 animate-spin text-[#2161f5]" />

                    <span className="mt-4 text-sm font-semibold text-[#111827]">
                      Uploading image...
                    </span>
                  </>
                ) : (
                  <>
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e8efff]">
                      <Upload className="h-8 w-8 text-[#2161f5]" />
                    </div>

                    <span className="mt-4 text-base font-semibold text-[#111827]">
                      Upload Hero Image
                    </span>

                    <span className="mt-1 text-sm text-[#4f46e5]">
                      Click here to select an
                      image
                    </span>

                    <span className="mt-2 text-xs text-[#94a3b8]">
                      JPG, PNG or WEBP
                    </span>
                  </>
                )}
              </button>
            )}
          </section>

          {/* =================================================
              BUTTONS
          ================================================= */}

          <section className="rounded-2xl border border-[#dce4ef] bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-bold text-[#111827]">
              Hero Buttons
            </h2>

            <p className="mt-1 text-sm text-[#4f46e5]">
              Configure the buttons displayed on
              the hero.
            </p>

            {/* PRIMARY */}

            <div className="mt-6 rounded-xl border border-[#dce4ef] bg-[#fafcff] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-[#111827]">
                    Primary Button
                  </h3>

                  <p className="mt-1 text-xs text-[#64748b]">
                    Main call-to-action button.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    updatePrimaryButton(
                      "enabled",
                      !slide.primaryButton
                        .enabled
                    )
                  }
                  className={`relative h-7 w-12 rounded-full transition ${
                    slide.primaryButton
                      .enabled
                      ? "bg-[#16a34a]"
                      : "bg-[#cbd5e1]"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                      slide.primaryButton
                        .enabled
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  value={
                    slide.primaryButton.text
                  }
                  onChange={(event) =>
                    updatePrimaryButton(
                      "text",
                      event.target.value
                    )
                  }
                  placeholder="Button text"
                  className="h-11 rounded-xl border border-[#cbd8e8] px-4 text-sm outline-none focus:border-[#2161f5]"
                />

                <input
                  type="text"
                  value={
                    slide.primaryButton.link
                  }
                  onChange={(event) =>
                    updatePrimaryButton(
                      "link",
                      event.target.value
                    )
                  }
                  placeholder="/contact"
                  className="h-11 rounded-xl border border-[#cbd8e8] px-4 text-sm outline-none focus:border-[#2161f5]"
                />
              </div>
            </div>

            {/* SECONDARY */}

            <div className="mt-4 rounded-xl border border-[#dce4ef] bg-[#fafcff] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-[#111827]">
                    Secondary Button
                  </h3>

                  <p className="mt-1 text-xs text-[#64748b]">
                    Secondary call-to-action button.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    updateSecondaryButton(
                      "enabled",
                      !slide.secondaryButton
                        .enabled
                    )
                  }
                  className={`relative h-7 w-12 rounded-full transition ${
                    slide.secondaryButton
                      .enabled
                      ? "bg-[#16a34a]"
                      : "bg-[#cbd5e1]"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                      slide.secondaryButton
                        .enabled
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  value={
                    slide.secondaryButton.text
                  }
                  onChange={(event) =>
                    updateSecondaryButton(
                      "text",
                      event.target.value
                    )
                  }
                  placeholder="Button text"
                  className="h-11 rounded-xl border border-[#cbd8e8] px-4 text-sm outline-none focus:border-[#2161f5]"
                />

                <input
                  type="text"
                  value={
                    slide.secondaryButton.link
                  }
                  onChange={(event) =>
                    updateSecondaryButton(
                      "link",
                      event.target.value
                    )
                  }
                  placeholder="/products"
                  className="h-11 rounded-xl border border-[#cbd8e8] px-4 text-sm outline-none focus:border-[#2161f5]"
                />
              </div>
            </div>
          </section>

          {/* =================================================
              SOCIAL LINKS
          ================================================= */}

          <section className="rounded-2xl border border-[#dce4ef] bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-bold text-[#111827]">
              Social Links
            </h2>

            <p className="mt-1 text-sm text-[#4f46e5]">
              Configure the social links shown on
              the hero.
            </p>

            <div className="mt-6 space-y-3">
              {slide.socialLinks.map(
                (social, index) => (
                  <div
                    key={social.platform}
                    className="grid grid-cols-1 gap-3 rounded-xl border border-[#dce4ef] bg-[#fafcff] p-4 sm:grid-cols-[140px_minmax(0,1fr)_auto]"
                  >
                    <div className="flex items-center">
                      <span className="text-sm font-semibold capitalize text-[#111827]">
                        {social.platform}
                      </span>
                    </div>

                    <input
                      type="text"
                      value={social.url}
                      onChange={(event) =>
                        updateSocialLink(
                          index,
                          "url",
                          event.target.value
                        )
                      }
                      placeholder={`https://${social.platform}.com/...`}
                      className="h-11 rounded-xl border border-[#cbd8e8] px-4 text-sm outline-none focus:border-[#2161f5]"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        updateSocialLink(
                          index,
                          "enabled",
                          !social.enabled
                        )
                      }
                      className={`flex h-11 items-center justify-center rounded-xl px-4 text-xs font-medium ${
                        social.enabled
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {social.enabled
                        ? "Enabled"
                        : "Disabled"}
                    </button>
                  </div>
                )
              )}
            </div>
          </section>

          {/* =================================================
              HERO SETTINGS
          ================================================= */}

          <section className="rounded-2xl border border-[#dce4ef] bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-bold text-[#111827]">
              Hero Settings
            </h2>

            <div className="mt-6 rounded-xl bg-[#f8fafc] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-[#111827]">
                    Published
                  </h3>

                  <p className="mt-1 text-xs text-[#64748b]">
                    Make this Hero visible on the
                    website.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setIsPublished(
                      !isPublished
                    )
                  }
                  className={`relative h-7 w-12 rounded-full transition ${
                    isPublished
                      ? "bg-[#16a34a]"
                      : "bg-[#cbd5e1]"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                      isPublished
                        ? "left-6"
                        : "left-1"
                    }`}
                  />
                </button>
              </div>

              <div className="mt-5 flex items-center gap-2">
                {isPublished ? (
                  <>
                    <Eye className="h-4 w-4 text-green-600" />

                    <span className="text-sm font-medium text-green-700">
                      Published
                    </span>
                  </>
                ) : (
                  <>
                    <EyeOff className="h-4 w-4 text-gray-500" />

                    <span className="text-sm font-medium text-gray-500">
                      Draft
                    </span>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* =================================================
              SAVE BUTTON
          ================================================= */}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || uploading}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#2161f5] text-sm font-semibold text-white shadow-sm transition hover:bg-[#174ed1] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />

                Saving Hero...
              </>
            ) : (
              <>
                Save Hero

                <ArrowUpRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>

        {/* ===================================================
            RIGHT SIDE — LIVE PREVIEW
        =================================================== */}

        <div className="xl:sticky xl:top-24 xl:self-start">
          <section className="overflow-hidden rounded-2xl border border-[#dce4ef] bg-white shadow-sm">
            {/* PREVIEW HEADER */}

            <div className="border-b border-[#dce4ef] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#111827]">
                    Live Preview
                  </h2>

                  <p className="mt-1 text-sm text-[#4f46e5]">
                    Preview how this hero will
                    appear.
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e8efff]">
                  <Eye className="h-4 w-4 text-[#2161f5]" />
                </div>
              </div>
            </div>

            {/* PREVIEW */}

            <div className="relative aspect-[16/10] overflow-hidden bg-[#101010]">
              {slide.backgroundImage ? (
                <img
                  src={
                    slide.backgroundImage
                  }
                  alt="Hero"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#151515]">
                  <ImageIcon className="h-12 w-12 text-white/30" />

                  <p className="mt-3 text-sm text-white/50">
                    Hero image preview
                  </p>
                </div>
              )}

              <div className="absolute inset-0 bg-black/50" />

              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

              {/* PREVIEW CONTENT */}

              <div className="relative z-10 flex h-full flex-col justify-center px-6 py-8">
                <p className="text-[8px] font-medium uppercase tracking-wider text-white">
                  {slide.eyebrow ||
                    "YOUR EYEBROW"}
                </p>

                <h3 className="mt-3 max-w-[85%] text-2xl font-semibold leading-tight text-white">
                  {slide.title ||
                    "Hero Title"}
                </h3>

                <p className="mt-3 max-w-[90%] text-[10px] leading-4 text-white/80">
                  {slide.description ||
                    "Hero description will appear here."}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {slide.primaryButton
                    .enabled && (
                    <span className="inline-flex items-center gap-2 bg-[#8dc8e8] px-3 py-2 text-[9px] font-medium text-black">
                      {
                        slide
                          .primaryButton
                          .text
                      }

                      <ArrowUpRight className="h-3 w-3" />
                    </span>
                  )}

                  {slide.secondaryButton
                    .enabled && (
                    <span className="inline-flex items-center gap-2 border border-white/60 px-3 py-2 text-[9px] font-medium text-white">
                      {
                        slide
                          .secondaryButton
                          .text
                      }

                      <ArrowUpRight className="h-3 w-3" />
                    </span>
                  )}
                </div>
              </div>

              {/* PREVIEW SOCIALS */}

              <div className="absolute right-4 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-2">
                {slide.socialLinks
                  .filter(
                    (social) =>
                      social.enabled
                  )
                  .map((social) => (
                    <span
                      key={
                        social.platform
                      }
                      className="flex h-6 w-6 items-center justify-center rounded-full border border-white/70 text-[8px] uppercase text-white"
                    >
                      {social.platform.charAt(
                        0
                      )}
                    </span>
                  ))}
              </div>
            </div>

            {/* PREVIEW STATUS */}

            <div className="border-t border-[#dce4ef] bg-[#f8fafc] p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#111827]">
                  Current Status
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    isPublished
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {isPublished
                    ? "Published"
                    : "Draft"}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}