import { NextResponse } from "next/server";

import { DENTAL_BRAND_TEAL } from "./constants";
import { escapeHtml } from "./html-escape";

export function buildDentalSimpleHtmlPage(title: string, body: string, maxWidthPx = 480): string {
  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"/><title>${escapeHtml(title)}</title></head>
<body style="font-family:Arial,sans-serif;max-width:${maxWidthPx}px;margin:48px auto;padding:24px;">
  <h1 style="color:${DENTAL_BRAND_TEAL};font-size:20px;">${escapeHtml(title)}</h1>
  <p style="line-height:1.6;color:#333;">${escapeHtml(body)}</p>
</body></html>`;
}

export function dentalHtmlResponse(title: string, body: string, status = 200, maxWidthPx = 480) {
  return new NextResponse(buildDentalSimpleHtmlPage(title, body, maxWidthPx), {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
