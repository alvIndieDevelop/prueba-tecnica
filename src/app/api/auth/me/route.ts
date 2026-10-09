import { NextResponse } from "next/server";
import { errorResponse, unexpectedErrorResponse } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return errorResponse("Authentication required.", 401);
    }

    return NextResponse.json({ user });
  } catch {
    return unexpectedErrorResponse();
  }
}
