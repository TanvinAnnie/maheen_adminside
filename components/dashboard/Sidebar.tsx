"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { FC } from "react";
import type { LucideProps } from "lucide-react";
import {
  LayoutDashboard,
  Image,
  BriefcaseBusiness,
  Package,
  FolderTree,
  ShoppingCart,
  Settings,
  LogOut,
} from "lucide-react";

type IconComponent = FC<LucideProps>;

const menus: { title: string; href: string; icon: IconComponent }[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
  title: "Hero",
  href: "/dashboard/hero",
  icon: Image,
},
{
  title: "Services",
  href: "/dashboard/services",
  icon: BriefcaseBusiness,
},
{
  title: "Photo Albums",
  href: "/dashboard/photo-albums",
  icon: Image,
},
  {
    title: "Products",
    href: "/products",
    icon: Package,
  },
  {
    title: "Categories",
    href: "/categories",
    icon: FolderTree,
  },
  {
    title: "Orders",
    href: "/orders",
    icon: ShoppingCart,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
   <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white shadow-xl">
      {/* Logo */}

      <div className="border-b text-white border-slate-800 px-8 py-7">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
            M
          </div>

          <div>

            <h2 className="text-xl font-bold text-white">
              Maheen
            </h2>

            <p className="text-sm text-slate-400">
              Admin Panel
            </p>

          </div>

        </div>

      </div>

      {/* Menu */}

      <div className="flex-1 text-white px-4 py-6">

        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Navigation
        </p>

        <nav className="space-y-2">

          {menus.map((menu) => {
            const Icon = menu.icon;

            const active = pathname === menu.href;

            return (
              <Link
                key={menu.href}
                href={menu.href}
                className={`flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200 ${
                  active
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <Icon size={20} />

                <span className="font-medium">
                  {menu.title}
                </span>
              </Link>
            );
          })}

        </nav>

      </div>

      {/* Footer */}

      <div className="border-t border-slate-800 p-5">

        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700"
        >
          <LogOut size={18} />

          Logout
        </button>

      </div>

    </aside>
  );
}