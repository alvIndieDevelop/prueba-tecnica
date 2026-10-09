"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface LogoutButtonProps {
  compact?: boolean;
}

export function LogoutButton({ compact = false }: LogoutButtonProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);

  async function handleLogout(): Promise<void> {
    setIsSubmitting(true);
    setHasError(false);

    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) {
        setHasError(true);
        return;
      }

      router.replace("/login");
      router.refresh();
    } catch {
      setHasError(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <button
        className={compact
          ? "rounded-lg border border-[#dce4dd] p-2 text-[#536158] transition hover:bg-[#f4f7f3] disabled:opacity-50"
          : "mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#dce4dd] px-3 py-2.5 text-sm font-medium text-[#536158] transition hover:border-[#bdcbc0] hover:bg-[#f7f9f7] disabled:opacity-50"}
        type="button"
        onClick={handleLogout}
        disabled={isSubmitting}
        aria-label={compact ? "Cerrar sesión" : undefined}
      >
        <LogoutIcon />
        {compact ? null : isSubmitting ? "Cerrando…" : "Cerrar sesión"}
      </button>
      {hasError && !compact ? <p className="mt-2 text-center text-xs text-[#a4382f]">Inténtalo de nuevo.</p> : null}
    </div>
  );
}

function LogoutIcon() {
  return (
    <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 17l5-5-5-5M15 12H3" />
      <path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" />
    </svg>
  );
}
