"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });

      if (!response.ok) {
        setError(response.status === 401 ? "Email o contraseña incorrectos." : "No se pudo iniciar sesión.");
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit} aria-busy={isSubmitting}>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#27332b]" htmlFor="email">
          Correo electrónico
        </label>
        <input
          className="w-full rounded-xl border border-[#ccd7ce] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#175c3a] focus:ring-4 focus:ring-[#175c3a]/10"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="demo@devpanel.local"
          defaultValue="demo@devpanel.local"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#27332b]" htmlFor="password">
          Contraseña
        </label>
        <input
          className="w-full rounded-xl border border-[#ccd7ce] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#175c3a] focus:ring-4 focus:ring-[#175c3a]/10"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••••••"
          required
          disabled={isSubmitting}
        />
      </div>

      <button
        className="w-full rounded-xl bg-[#175c3a] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#104c2e] focus:outline-none focus:ring-4 focus:ring-[#175c3a]/20 disabled:cursor-wait disabled:opacity-60"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Verificando…" : "Iniciar sesión"}
      </button>

      <div className="min-h-5" aria-live="polite">
        {error ? <p className="text-center text-sm text-[#a4382f]">{error}</p> : null}
      </div>
    </form>
  );
}
