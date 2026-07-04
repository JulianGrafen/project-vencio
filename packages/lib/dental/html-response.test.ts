import { describe, expect, it } from "vitest";

import { buildDentalSimpleHtmlPage } from "./html-response";

describe("html-response", () => {
  it("escapes HTML in title and body", () => {
    const html = buildDentalSimpleHtmlPage("<script>", 'alert("xss")');
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });
});
