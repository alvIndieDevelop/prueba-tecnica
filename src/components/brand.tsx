import Link from "next/link";

export function Brand() {
  return (
    <Link className="inline-flex items-center gap-3" href="/" aria-label="DevPanel">
      <span className="grid size-9 place-items-center rounded-xl bg-[#175c3a] text-sm font-bold text-white shadow-sm">
        DP
      </span>
      <span className="text-base font-semibold tracking-[-0.02em] text-[#16201a]">
        DevPanel
      </span>
    </Link>
  );
}
