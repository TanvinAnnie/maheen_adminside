"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  BriefcaseBusiness,
  Edit,
  Plus,
  RefreshCw,
  Search,
  Trash2,
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
  createdAt?: string;
  updatedAt?: string;
};

export default function ServicesPage() {
  const [service, setService] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/services", {
        cache: "no-store",
      });

      const result = await response.json();

      if (response.status === 404) {
        setService(null);
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to fetch services"
        );
      }

      setService(result.data);
    } catch (error) {
      console.error("Services fetch error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load services"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadServices();
  }, [loadServices]);

  const handleDelete = async () => {
    if (!service?._id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete the Services section?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      const response = await fetch("/api/services", {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to delete services"
        );
      }

      setService(null);
    } catch (error) {
      console.error("Delete services error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete services"
      );
    } finally {
      setDeleting(false);
    }
  };

  const filteredItems =
    service?.items.filter((item) => {
      const query = search.trim().toLowerCase();

      if (!query) return true;

      return (
        item.title.toLowerCase().includes(query) ||
        item.number.toLowerCase().includes(query)
      );
    }) ?? [];

  const formatDate = (date?: string) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-[500px] bg-[#f4f7fb] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1450px]">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-sm text-gray-500">
              Loading services...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1450px]">
        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#111827]">
              Services
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your homepage services section.
            </p>
          </div>

          <Link
            href="/dashboard/services/new"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Plus size={17} />
            Add Service
          </Link>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* EMPTY STATE */}
        {!service ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <BriefcaseBusiness size={26} />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-gray-900">
              No Services Content
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              Create your homepage Services section with a heading,
              description, images, and service cards.
            </p>

            <Link
              href="/dashboard/services/new"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <Plus size={17} />
              Create Services
            </Link>
          </div>
        ) : (
          <>
            {/* MAIN TABLE CARD */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              {/* SEARCH */}
              <div className="flex flex-col gap-4 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="relative w-full sm:max-w-[360px]">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search services..."
                    className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <span className="text-sm text-gray-500">
                  Search by service title or number
                </span>
              </div>

              {/* DESKTOP TABLE */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[850px]">
                  <thead>
                    <tr className="border-b border-gray-200 bg-[#f4f7fb]">
                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-700">
                        Service
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-700">
                        Number
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-700">
                        Status
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-700">
                        Updated
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item) => (
                        <tr
                          key={item._id || item.number}
                          className="border-b border-gray-100 transition hover:bg-gray-50"
                        >
                          {/* SERVICE */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.title || "Service"}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center">
                                    <BriefcaseBusiness
                                      size={18}
                                      className="text-gray-400"
                                    />
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-gray-900">
                                  {item.title || "Untitled Service"}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                  Homepage service
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* NUMBER */}
                          <td className="px-5 py-4">
                            <span className="text-sm font-medium text-blue-600">
                              {item.number}
                            </span>
                          </td>

                          {/* STATUS */}
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                item.isActive
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {item.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>

                          {/* UPDATED */}
                          <td className="px-5 py-4 text-sm text-gray-500">
                            {formatDate(service.updatedAt)}
                          </td>

                          {/* ACTIONS */}
                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">
                              <Link
                                href="/dashboard/services/new"
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                                aria-label="Edit services"
                              >
                                <Edit size={16} />
                              </Link>

                              <button
                                type="button"
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                aria-label="Delete services"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-5 py-12 text-center"
                        >
                          <p className="text-sm font-medium text-gray-700">
                            No matching services found
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            Try a different search term.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS */}
              <div className="divide-y divide-gray-100 md:hidden">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <div
                      key={item._id || item.number}
                      className="p-4"
                    >
                      <div className="flex gap-4">
                        <div className="h-20 w-24 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title || "Service"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <BriefcaseBusiness
                                size={20}
                                className="text-gray-400"
                              />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {item.title || "Untitled Service"}
                              </p>

                              <p className="mt-1 text-xs text-blue-600">
                                {item.number}
                              </p>
                            </div>

                            <span
                              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                                item.isActive
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {item.isActive
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              Updated{" "}
                              {formatDate(service.updatedAt)}
                            </span>

                            <div className="flex gap-2">
                              <Link
                                href="/dashboard/services/new"
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600"
                                aria-label="Edit services"
                              >
                                <Edit size={15} />
                              </Link>

                              <button
                                type="button"
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 disabled:opacity-50"
                                aria-label="Delete services"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-5 py-12 text-center">
                    <p className="text-sm font-medium text-gray-700">
                      No matching services found
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Try a different search term.
                    </p>
                  </div>
                )}
              </div>

              {/* FOOTER */}
              <div className="flex flex-col gap-4 border-t border-gray-200 bg-[#f8fafc] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-medium text-blue-600">
                    {filteredItems.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-blue-600">
                    {service.items.length}
                  </span>{" "}
                  services
                </p>

                <button
                  type="button"
                  onClick={() => void loadServices()}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  <RefreshCw size={16} />
                  Refresh
                </button>
              </div>
            </div>

            {/* SECTION STATUS */}
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    Services Section Status
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Control whether the complete Services section
                    appears on the client website.
                  </p>
                </div>

                <span
                  className={`inline-flex w-fit rounded-full px-4 py-2 text-xs font-semibold ${
                    service.isPublished
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {service.isPublished
                    ? "Published"
                    : "Unpublished"}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}