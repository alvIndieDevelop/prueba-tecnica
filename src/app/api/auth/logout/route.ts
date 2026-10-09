import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { unexpectedErrorResponse } from "@/lib/api";
import { invalidateSession, SESSION_COOKIE_NAME } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    invalidateSession(cookieStore.get(SESSION_COOKIE_NAME)?.value);

    const response = new NextResponse(null, { status: 204 });
    response.cookies.set(SESSION_COOKIE_NAME, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
      expires: new Date(0),
    });

    return response;
  } catch {
    return unexpectedErrorResponse();
  }
}
