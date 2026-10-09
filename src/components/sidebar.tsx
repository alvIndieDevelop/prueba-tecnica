import Link from "next/link";
import { Brand } from "@/components/brand";
import { LogoutButton } from "@/components/logout-button";
import type { PublicUser } from "@/lib/types";

interface SidebarProps {
  user: PublicUser;
}

export function Sidebar({ user }: SidebarProps) {
  return (
    <aside className="flex items-center gap-4 border-b border-[#dce4dd] bg-white px-5 py-4 lg:fixed lg:inset-y-0 lg:block lg:w-64 lg:border-r lg:border-b-0 lg:px-7 lg:py-7">
      <Brand />
      <nav className="mt-0 ml-auto flex items-center lg:mt-12 lg:ml-0 lg:block" aria-label="Principal">
        <Link
          className="flex items-center gap-3 rounded-xl bg-[#e9f2eb] px-4 py-3 text-sm font-semibold text-[#175c3a]"
          href="/dashboard"
          aria-current="page"
        >
          <DashboardIcon />
          <span className="hidden sm:inline">Resumen</span>
        </Link>
      </nav>
      <div className="lg:hidden"><LogoutButton compact /></div>
      <div className="mt-auto hidden border-t border-[#e5ebe6] pt-5 lg:absolute lg:right-7 lg:bottom-7 lg:left-7 lg:block">
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#e9f2eb] text-xs font-semibold text-[#175c3a]">
            {getInitials(user.name)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#27332b]">{user.name}</p>
            <p className="truncate text-xs text-[#7a867e]">{user.email}</p>
          </div>
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function DashboardIcon() {
  return (
    <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
