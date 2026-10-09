"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MetricCard } from "@/components/metric-card";
import { UsersTable } from "@/components/users-table";
import type { DashboardMetrics } from "@/lib/types";

export function DashboardContent() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [metricsError, setMetricsError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMetrics(): Promise<void> {
      try {
        const response = await fetch("/api/metrics", { signal: controller.signal });
        if (response.status === 401) {
          router.replace("/login");
          router.refresh();
          return;
        }
        if (!response.ok) {
          throw new Error("Metrics request failed");
        }

        setMetrics((await response.json()) as DashboardMetrics);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setMetricsError(true);
        }
      }
    }

    void loadMetrics();
    return () => controller.abort();
  }, [router]);

  return (
    <>
      {metricsError ? (
        <div className="mt-8 flex items-center justify-between gap-4 rounded-xl border border-[#e5c9c5] bg-[#fff8f7] px-4 py-3 text-sm text-[#8b3029]" role="alert">
          <span>No se pudieron cargar las métricas.</span>
          <button className="font-semibold underline underline-offset-4" type="button" onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </div>
      ) : null}

      <section className="mt-8 grid gap-4 sm:grid-cols-3" aria-label="Métricas principales" aria-live="polite">
        <MetricCard
          label="Usuarios totales"
          description="Conteo completo desde la base de datos"
          value={metrics?.totalUsers ?? null}
          isLoading={!metrics && !metricsError}
        />
        <MetricCard
          label="Usuarios activos"
          description="Cuentas con estado activo"
          value={metrics?.activeUsers ?? null}
          isLoading={!metrics && !metricsError}
        />
        <MetricCard
          label="Usuarios inactivos"
          description="Cuentas actualmente fuera de operación"
          value={metrics ? metrics.totalUsers - metrics.activeUsers : null}
          isLoading={!metrics && !metricsError}
        />
      </section>

      <div className="mt-6"><UsersTable /></div>
    </>
  );
}
