import { NextResponse } from "next/server";
import { errorResponse, unexpectedErrorResponse } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { getDashboardMetrics } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return errorResponse("Authentication required.", 401);
    }

    return NextResponse.json(getDashboardMetrics());
  } catch {
    return unexpectedErrorResponse();
  }
}
