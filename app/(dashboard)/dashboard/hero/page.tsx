"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  RefreshCw,
  Image as ImageIcon,
} from "lucide-react";

type HeroButton = {
  text: string;
  link: string;
  enabled: boolean;
};

type HeroSocialLink = {
  platform: string;
  url: string;
  enabled: boolean;
};

type HeroSlide = {
  _id?: string;
  eyebrow: string;
  title: string;
  description: string;
  backgroundImage: string;
  primaryButton: HeroButton;
  secondaryButton: HeroButton;
  socialLinks: HeroSocialLink[];
  order: number;
  isActive: boolean;
};

type Hero = {
  _id: string;
  slides: HeroSlide[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function HeroPage() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toast = {
    success: (message: string) => window.alert(message),
    error: (message: string) => window.alert(message),
  };

  /* =========================================================
     FETCH HEROES
  ========================================================= */

  const fetchHeroes = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/hero", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to fetch heroes"
        );
      }

      /*
       * Your API may return either:
       *
       * data: [...]
       *
       * or
       *
       * data: {...}
       *
       * We normalize both here.
       */

      const heroData = Array.isArray(result.data)
        ? result.data
        : result.data
          ? [result.data]
          : [];

      setHeroes(heroData);
    } catch (error) {
      console.error("Hero fetch error:", error);

      toast.error("Failed to load hero content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadHeroes = async () => {
      await fetchHeroes();
    };

    loadHeroes();
  }, []);

  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredHeroes = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return heroes;
    }

    return heroes.filter((hero) => {
      return hero.slides.some((slide) => {
        return (
          slide.title
            ?.toLowerCase()
            .includes(query) ||
          slide.eyebrow
            ?.toLowerCase()
            .includes(query) ||
          slide.description
            ?.toLowerCase()
            .includes(query)
        );
      });
    });
  }, [heroes, search]);

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this Hero?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      const response = await fetch(
        `/api/hero/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to delete hero"
        );
      }

      toast.success("Hero deleted successfully");

      await fetchHeroes();
    } catch (error) {
      console.error("Hero delete error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete hero"
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* =========================================================
     STATUS
  ========================================================= */

  const getHeroStatus = (hero: Hero) => {
    if (!hero.isPublished) {
      return {
        label: "Draft",
        className:
          "bg-amber-100 text-amber-700",
      };
    }

    const activeSlides = hero.slides.filter(
      (slide) => slide.isActive
    );

    if (activeSlides.length === 0) {
      return {
        label: "Inactive",
        className:
          "bg-red-100 text-red-600",
      };
    }

    return {
      label: "Active",
      className:
        "bg-green-100 text-green-700",
    };
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f7fb] p-6">
        <div className="animate-pulse">
          <div className="h-8 w-32 rounded bg-gray-200" />

          <div className="mt-3 h-4 w-64 rounded bg-gray-200" />

          <div className="mt-8 h-72 rounded-2xl bg-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-4 sm:p-6">
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] sm:text-3xl">
            Hero
          </h1>

          <p className="mt-1 text-sm text-[#4f46e5]">
            Manage your website hero sections.
          </p>
        </div>

        <Link
          href="/dashboard/hero/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#2161f5] px-5 text-sm font-medium text-white shadow-sm transition hover:bg-[#174ed1]"
        >
          <Plus className="h-4 w-4" />

          Add Hero
        </Link>
      </div>

      {/* =====================================================
          MAIN CARD
      ===================================================== */}

      <div className="overflow-hidden rounded-2xl border border-[#dce4ef] bg-white shadow-sm">
        {/* ===================================================
            SEARCH AREA
        =================================================== */}

        <div className="flex flex-col gap-4 border-b border-[#dce4ef] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-[420px]">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b9bb5]" />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search heroes..."
              className="h-11 w-full rounded-xl border border-[#d5deeb] bg-white pl-11 pr-4 text-sm text-[#111827] outline-none transition placeholder:text-[#9aa8bc] focus:border-[#2161f5] focus:ring-2 focus:ring-[#2161f5]/10"
            />
          </div>

          <p className="text-sm text-[#53657d]">
            Search by hero title
          </p>
        </div>

        {/* ===================================================
            DESKTOP TABLE
        =================================================== */}

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f1f5fa] text-left">
                <th className="px-6 py-4 text-sm font-semibold text-[#4f46e5]">
                  Hero
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-[#4f46e5]">
                  Slides
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-[#4f46e5]">
                  Status
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-[#4f46e5]">
                  Updated
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-[#4f46e5]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredHeroes.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-16 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <ImageIcon className="h-10 w-10 text-[#b8c4d5]" />

                      <p className="mt-3 text-sm font-medium text-[#475569]">
                        No hero found
                      </p>

                      <p className="mt-1 text-xs text-[#94a3b8]">
                        Create your first hero section.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredHeroes.map((hero) => {
                  const firstSlide =
                    hero.slides?.[0];

                  const status =
                    getHeroStatus(hero);

                  return (
                    <tr
                      key={hero._id}
                      className="border-t border-[#e1e8f0] transition hover:bg-[#fafcff]"
                    >
                      {/* HERO */}

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-20 overflow-hidden rounded-lg bg-[#eef2f7]">
                            {firstSlide?.backgroundImage ? (
                              <img
                                src={
                                  firstSlide.backgroundImage
                                }
                                alt={
                                  firstSlide.title ||
                                  "Hero"
                                }
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <ImageIcon className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-[360px] truncate text-sm font-semibold text-[#111827]">
                              {firstSlide?.title ||
                                "Untitled Hero"}
                            </p>

                            <p className="mt-1 max-w-[360px] truncate text-xs text-[#718096]">
                              {firstSlide?.eyebrow ||
                                "No eyebrow text"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* SLIDES */}

                      <td className="px-6 py-4 text-sm text-[#111827]">
                        {hero.slides?.length || 0}
                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </td>

                      {/* UPDATED */}

                      <td className="px-6 py-4 text-sm text-[#475569]">
                        {new Date(
                          hero.updatedAt
                        ).toLocaleDateString()}
                      </td>

                      {/* ACTIONS */}

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/dashboard/hero/${hero._id}/edit`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e4edff] text-[#4f46e5] transition hover:bg-[#d7e4ff]"
                            title="Edit Hero"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(hero._id)
                            }
                            disabled={
                              deletingId === hero._id
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ffe5e7] text-[#ff3b45] transition hover:bg-[#ffd9dc] disabled:cursor-not-allowed disabled:opacity-50"
                            title="Delete Hero"
                          >
                            {deletingId ===
                            hero._id ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ===================================================
            MOBILE CARDS
        =================================================== */}

        <div className="space-y-4 p-4 md:hidden">
          {filteredHeroes.length === 0 ? (
            <div className="py-12 text-center">
              <ImageIcon className="mx-auto h-10 w-10 text-[#b8c4d5]" />

              <p className="mt-3 text-sm font-medium text-[#475569]">
                No hero found
              </p>
            </div>
          ) : (
            filteredHeroes.map((hero) => {
              const firstSlide =
                hero.slides?.[0];

              const status =
                getHeroStatus(hero);

              return (
                <div
                  key={hero._id}
                  className="rounded-xl border border-[#dce4ef] p-4"
                >
                  <div className="flex gap-4">
                    <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-[#eef2f7]">
                      {firstSlide?.backgroundImage && (
                        <img
                          src={
                            firstSlide.backgroundImage
                          }
                          alt={
                            firstSlide.title ||
                            "Hero"
                          }
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-[#111827]">
                        {firstSlide?.title ||
                          "Untitled Hero"}
                      </h3>

                      <p className="mt-1 text-xs text-[#718096]">
                        {hero.slides?.length || 0}{" "}
                        slide
                        {hero.slides?.length === 1
                          ? ""
                          : "s"}
                      </p>

                      <span
                        className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2 border-t border-[#e5eaf1] pt-4">
                    <Link
                      href={`/dashboard/hero/${hero._id}/edit`}
                      className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[#e4edff] text-sm font-medium text-[#4f46e5]"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(hero._id)
                      }
                      disabled={
                        deletingId === hero._id
                      }
                      className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[#ffe5e7] text-sm font-medium text-[#ff3b45]"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ===================================================
            FOOTER
        =================================================== */}

        <div className="flex flex-col gap-4 border-t border-[#dce4ef] bg-[#f8fafc] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#4f46e5]">
            Showing{" "}
            <span className="font-semibold">
              {filteredHeroes.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold">
              {heroes.length}
            </span>{" "}
            heroes
          </p>

          <button
            type="button"
            onClick={fetchHeroes}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#cbd5e1] bg-white px-4 text-sm font-medium text-[#334155] transition hover:bg-[#f8fafc]"
          >
            <RefreshCw className="h-4 w-4" />

            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}