import { NextResponse } from "next/server";
import {
  authenticateCredentials,
  createSession,
  SESSION_COOKIE_NAME,
  SESSION_DURATION_SECONDS,
} from "@/lib/auth";
import { errorResponse, unexpectedErrorResponse } from "@/lib/api";

export const runtime = "nodejs";

interface LoginInput {
  email: string;
  password: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Email and password are required.", 400);
  }

  try {
    const input = parseLoginInput(body);
    if (!input) {
      return errorResponse("Email and password are required.", 400);
    }

    const user = await authenticateCredentials(input.email, input.password);
    if (!user) {
      return errorResponse("Invalid credentials.", 401);
    }

    const session = createSession(user.id);
    const response = NextResponse.json({ user });

    response.cookies.set(SESSION_COOKIE_NAME, session.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_DURATION_SECONDS,
      expires: session.expiresAt,
    });

    return response;
  } catch {
    return unexpectedErrorResponse();
  }
}

function parseLoginInput(value: unknown): LoginInput | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const email = "email" in value && typeof value.email === "string" ? value.email.trim().toLowerCase() : "";
  const password = "password" in value && typeof value.password === "string" ? value.password : "";

  if (!email || email.length > 254 || !email.includes("@") || !password || password.length > 256) {
    return null;
  }

  return { email, password };
}
