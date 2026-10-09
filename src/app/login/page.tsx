import { Brand } from "@/components/brand";
import { LoginForm } from "@/components/login-form";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <section className="hidden overflow-hidden bg-[#153f2b] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3 text-white">
          <span className="grid size-10 place-items-center rounded-xl bg-white/12 text-sm font-bold">DP</span>
          <span className="font-semibold">DevPanel</span>
        </div>
        <div className="max-w-xl">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-[#add0b8]">Operaciones claras</p>
          <h1 className="text-5xl leading-[1.05] font-semibold tracking-[-0.05em]">
            Tu equipo,
            <br />en una sola vista.
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-[#c8dbce]">
            Métricas esenciales y usuarios organizados para tomar decisiones sin ruido.
          </p>
        </div>
        <p className="text-xs text-[#91b59d]">Panel interno · Acceso protegido</p>
      </section>

      <section className="flex items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-md">
          <div className="mb-12 lg:hidden"><Brand /></div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#5f7e68]">Acceso seguro</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#16201a]">Bienvenido de nuevo</h2>
          <p className="mt-3 text-sm leading-6 text-[#66736b]">Ingresa tus credenciales para acceder al panel.</p>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
