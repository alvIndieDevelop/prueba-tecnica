"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { PublicUser, UserRole, UserStatus } from "@/lib/types";

interface UsersResponse {
  users: PublicUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const PAGE_SIZE = 10;

export function UsersTable() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [status, setStatus] = useState<UserStatus | "">("");
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestKey, setRequestKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        if (query.trim()) {
          params.set("q", query.trim());
        }
        if (role) {
          params.set("role", role);
        }
        if (status) {
          params.set("status", status);
        }
        params.set("page", page.toString());
        params.set("limit", PAGE_SIZE.toString());

        const response = await fetch(`/api/users?${params.toString()}`, { signal: controller.signal });
        if (response.status === 401) {
          router.replace("/login");
          router.refresh();
          return;
        }
        if (!response.ok) {
          throw new Error("Users request failed");
        }

        const data = (await response.json()) as UsersResponse;
        setUsers(data.users);
        setTotal(data.total);
        setPage(data.page);
        setTotalPages(data.totalPages);
        setError(null);
      } catch (requestError) {
        if (!(requestError instanceof DOMException && requestError.name === "AbortError")) {
          setError("No se pudo cargar el directorio.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [query, role, status, page, requestKey, router]);

  function handleQueryChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setQuery(event.target.value);
    prepareRequest(true);
  }

  function handleRoleChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    setRole(event.target.value as UserRole | "");
    prepareRequest(true);
  }

  function handleStatusChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    setStatus(event.target.value as UserStatus | "");
    prepareRequest(true);
  }

  function clearFilters(): void {
    setQuery("");
    setRole("");
    setStatus("");
    prepareRequest(true);
  }

  function prepareRequest(resetPage = false): void {
    if (resetPage) {
      setPage(1);
    }
    setIsLoading(true);
    setError(null);
  }

  function goToPage(nextPage: number): void {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) {
      return;
    }

    setPage(nextPage);
    prepareRequest();
  }

  function retry(): void {
    setIsLoading(true);
    setError(null);
    setRequestKey((value) => value + 1);
  }

  const hasFilters = Boolean(query || role || status);
  const firstVisibleUser = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const lastVisibleUser = Math.min(page * PAGE_SIZE, total);

  return (
    <section className="overflow-hidden rounded-2xl border border-[#dce4dd] bg-white shadow-[0_8px_30px_rgba(24,48,33,0.04)]" aria-busy={isLoading}>
      <div className="flex flex-col gap-4 border-b border-[#e5ebe6] px-5 py-5 xl:flex-row xl:items-end xl:justify-between sm:px-6">
        <div>
          <h2 className="font-semibold tracking-[-0.02em]">Usuarios</h2>
          <p className="mt-1 text-sm text-[#6d796f]">
            {isLoading ? "Actualizando directorio…" : `${total} ${total === 1 ? "usuario" : "usuarios"}`}
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-[minmax(16rem,1fr)_auto_auto_auto]">
          <label className="relative block">
            <span className="sr-only">Buscar usuarios</span>
            <SearchIcon />
            <input
              className="w-full rounded-xl border border-[#d7e0d9] bg-[#f7f9f7] py-2.5 pr-4 pl-10 text-sm text-[#27332b] outline-none transition placeholder:text-[#8a958d] focus:border-[#175c3a] focus:bg-white focus:ring-4 focus:ring-[#175c3a]/10"
              type="search"
              placeholder="Buscar por nombre o email"
              value={query}
              onChange={handleQueryChange}
            />
          </label>
          <label>
            <span className="sr-only">Filtrar por rol</span>
            <select
              className="h-full w-full rounded-xl border border-[#d7e0d9] bg-[#f7f9f7] px-3 py-2.5 text-sm text-[#536158] outline-none focus:border-[#175c3a] focus:bg-white focus:ring-4 focus:ring-[#175c3a]/10"
              value={role}
              onChange={handleRoleChange}
            >
              <option value="">Todos los roles</option>
              <option value="admin">Administrador</option>
              <option value="member">Miembro</option>
            </select>
          </label>
          <label>
            <span className="sr-only">Filtrar por estado</span>
            <select
              className="h-full w-full rounded-xl border border-[#d7e0d9] bg-[#f7f9f7] px-3 py-2.5 text-sm text-[#536158] outline-none focus:border-[#175c3a] focus:bg-white focus:ring-4 focus:ring-[#175c3a]/10"
              value={status}
              onChange={handleStatusChange}
            >
              <option value="">Todos los estados</option>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </label>
          <button
            className="rounded-xl border border-[#d7e0d9] px-3 py-2.5 text-sm font-medium text-[#536158] transition hover:bg-[#f4f7f3] disabled:cursor-not-allowed disabled:opacity-40"
            type="button"
            onClick={clearFilters}
            disabled={!hasFilters}
          >
            Limpiar
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-[#f8faf8] text-xs uppercase tracking-[0.08em] text-[#748078]">
            <tr>
              <th className="px-6 py-3 font-medium" scope="col">Usuario</th>
              <th className="px-6 py-3 font-medium" scope="col">Rol</th>
              <th className="px-6 py-3 font-medium" scope="col">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#edf1ed]">
            {isLoading ? <LoadingRows /> : null}
            {!isLoading && error ? (
              <tr>
                <td className="px-6 py-12 text-center text-[#8b3029]" colSpan={3}>
                  <p>{error}</p>
                  <button className="mt-3 font-semibold underline underline-offset-4" type="button" onClick={retry}>Reintentar</button>
                </td>
              </tr>
            ) : null}
            {!isLoading && !error && users.length === 0 ? (
              <tr>
                <td className="px-6 py-12 text-center text-[#748078]" colSpan={3}>
                  No hay usuarios que coincidan con la búsqueda.
                </td>
              </tr>
            ) : null}
            {!isLoading && !error ? users.map((user) => <UserRow key={user.id} user={user} />) : null}
          </tbody>
        </table>
      </div>
      {!isLoading && !error && total > 0 ? (
        <footer className="flex flex-col gap-3 border-t border-[#e5ebe6] bg-[#fbfcfb] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-[#66736b]">
            Mostrando <span className="font-semibold text-[#27332b]">{firstVisibleUser}–{lastVisibleUser}</span> de {total}
          </p>
          <nav className="flex items-center gap-2" aria-label="Paginación de usuarios">
            <button
              className="rounded-lg border border-[#d7e0d9] bg-white px-3 py-2 text-sm font-medium text-[#536158] transition hover:border-[#bdcbc0] hover:bg-[#f4f7f3] disabled:cursor-not-allowed disabled:opacity-40"
              type="button"
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
            >
              Anterior
            </button>
            <span className="min-w-24 text-center text-sm font-medium text-[#536158]">
              Página {page} de {totalPages}
            </span>
            <button
              className="rounded-lg border border-[#d7e0d9] bg-white px-3 py-2 text-sm font-medium text-[#536158] transition hover:border-[#bdcbc0] hover:bg-[#f4f7f3] disabled:cursor-not-allowed disabled:opacity-40"
              type="button"
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
            >
              Siguiente
            </button>
          </nav>
        </footer>
      ) : null}
    </section>
  );
}

function UserRow({ user }: { user: PublicUser }) {
  const isActive = user.status === "active";

  return (
    <tr className="transition hover:bg-[#fafcfa]">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#e9f2eb] text-xs font-semibold text-[#175c3a]">
            {user.name.slice(0, 1).toUpperCase()}
          </span>
          <div>
            <p className="font-medium text-[#27332b]">{user.name}</p>
            <p className="mt-0.5 text-xs text-[#7a867e]">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 capitalize text-[#536158]">{user.role === "admin" ? "Administrador" : "Miembro"}</td>
      <td className="px-6 py-4">
        <span className={isActive
          ? "inline-flex rounded-full bg-[#e9f4eb] px-2.5 py-1 text-xs font-semibold text-[#277044]"
          : "inline-flex rounded-full bg-[#f1f2f1] px-2.5 py-1 text-xs font-semibold text-[#68736b]"}>
          {isActive ? "Activo" : "Inactivo"}
        </span>
      </td>
    </tr>
  );
}

function LoadingRows() {
  return Array.from({ length: 5 }, (_, index) => (
    <tr key={index} aria-hidden="true">
      <td className="px-6 py-5"><span className="block h-9 w-52 animate-pulse rounded-lg bg-[#edf1ed]" /></td>
      <td className="px-6 py-5"><span className="block h-5 w-20 animate-pulse rounded bg-[#edf1ed]" /></td>
      <td className="px-6 py-5"><span className="block h-5 w-16 animate-pulse rounded bg-[#edf1ed]" /></td>
    </tr>
  ));
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#7d8880]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}
