import { type NextRequest, NextResponse } from "next/server";
import { errorResponse, unexpectedErrorResponse } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { searchUsers } from "@/lib/db";
import type { UserRole, UserStatus } from "@/lib/types";

export const runtime = "nodejs";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return errorResponse("Authentication required.", 401);
    }

    const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";
    if (query.length > 100) {
      return errorResponse("Search query must be 100 characters or fewer.", 400);
    }

    const role = parseRole(request.nextUrl.searchParams.get("role"));
    const status = parseStatus(request.nextUrl.searchParams.get("status"));
    if (role === null || status === null) {
      return errorResponse("Invalid user filters.", 400);
    }

    const page = parsePositiveInteger(request.nextUrl.searchParams.get("page"), 1);
    const limit = parsePageLimit(request.nextUrl.searchParams.get("limit"));
    if (page === null || limit === null) {
      return errorResponse("Invalid pagination parameters.", 400);
    }

    return NextResponse.json(searchUsers({
      query: escapeLikeQuery(query),
      role,
      status,
      page,
      limit,
    }));
  } catch {
    return unexpectedErrorResponse();
  }
}

function parseRole(value: string | null): UserRole | undefined | null {
  if (value === null) return undefined;
  return value === "admin" || value === "member" ? value : null;
}

function parseStatus(value: string | null): UserStatus | undefined | null {
  if (value === null) return undefined;
  return value === "active" || value === "inactive" ? value : null;
}

function parsePositiveInteger(value: string | null, defaultValue: number): number | null {
  if (value === null) return defaultValue;
  if (!/^\d+$/.test(value)) return null;

  const parsedValue = Number(value);
  return Number.isSafeInteger(parsedValue) && parsedValue > 0 ? parsedValue : null;
}

function parsePageLimit(value: string | null): number | null {
  const limit = parsePositiveInteger(value, 10);
  return limit !== null && [10, 20, 50].includes(limit) ? limit : null;
}

function escapeLikeQuery(query: string): string {
  return query.replaceAll("\\", "\\\\").replaceAll("%", "\\%").replaceAll("_", "\\_");
}
