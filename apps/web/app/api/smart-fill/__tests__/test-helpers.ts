import type { NextRequest } from "next/server";

export function createSmartFillTokenRequest(path: "confirm" | "decline", token?: string): NextRequest {
  const url = token
    ? `https://app.example.com/api/smart-fill/${path}?token=${token}`
    : `https://app.example.com/api/smart-fill/${path}`;
  const urlObj = new URL(url);
  return {
    nextUrl: { searchParams: urlObj.searchParams },
  } as unknown as NextRequest;
}
