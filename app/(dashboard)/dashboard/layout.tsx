import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/dashboard/Navbar";
import { verifyToken } from "@/lib/jwt";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-100">

      <div className="flex">

        <Sidebar />

        <div className="flex min-h-screen flex-1 flex-col">

          <Navbar />

          <main className="flex-1 p-8">
            {children}
          </main>

        </div>

      </div>

    </div>
  );
}