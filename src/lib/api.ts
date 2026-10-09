import { NextResponse } from "next/server";

export function errorResponse(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

export function unexpectedErrorResponse(): NextResponse {
  return errorResponse("Unexpected server error.", 500);
}
