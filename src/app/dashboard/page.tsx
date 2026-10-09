import { DashboardContent } from "@/components/dashboard-content";
import { Sidebar } from "@/components/sidebar";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen">
      <Sidebar user={user} />
      <main className="px-5 py-8 sm:px-8 lg:ml-64 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-6xl">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#5f7e68]">Vista general</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">Hola, {user.name.split(" ")[0]}</h1>
              <p className="mt-2 text-sm text-[#66736b]">Este es el estado actual de tu directorio.</p>
            </div>
            <p className="rounded-full border border-[#cfe0d2] bg-[#f4f9f5] px-3 py-1.5 text-xs font-medium text-[#34704a]">
              Sesión activa
            </p>
          </header>

          <DashboardContent />
        </div>
      </main>
    </div>
  );
}
