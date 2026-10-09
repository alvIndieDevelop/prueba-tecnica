interface MetricCardProps {
  label: string;
  description: string;
  value: number | null;
  isLoading: boolean;
}

export function MetricCard({ label, description, value, isLoading }: MetricCardProps) {
  return (
    <article className="rounded-2xl border border-[#dce4dd] bg-white p-6 shadow-[0_8px_30px_rgba(24,48,33,0.04)]">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-sm font-medium text-[#66736b]">{label}</p>
          {isLoading ? (
            <span className="mt-4 block h-10 w-16 animate-pulse rounded-lg bg-[#e8eee9]" aria-label={`${label}: cargando`} />
          ) : (
            <p className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[#16201a]" aria-label={`${label}: ${value ?? "sin datos"}`}>
              {value ?? "—"}
            </p>
          )}
        </div>
        <span className="grid size-10 place-items-center rounded-xl bg-[#eef5ef] text-[#175c3a]">
          <UsersIcon />
        </span>
      </div>
      <p className="mt-5 border-t border-[#edf1ed] pt-4 text-xs text-[#7a867e]">{description}</p>
    </article>
  );
}

function UsersIcon() {
  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
