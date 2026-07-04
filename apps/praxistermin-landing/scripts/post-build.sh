#!/usr/bin/env bash
# Post-build helpers for GitHub Pages (called from package.json build script).
set -euo pipefail

DIST="${1:-dist}"

cp "$DIST/index.html" "$DIST/404.html"
touch "$DIST/.nojekyll"

if [[ -n "${PAGES_CUSTOM_DOMAIN:-}" ]]; then
  echo "$PAGES_CUSTOM_DOMAIN" > "$DIST/CNAME"
fi

if [[ -n "${VITE_SITE_URL:-}" ]]; then
  cat > "$DIST/sitemap.xml" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${VITE_SITE_URL%/}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
EOF
fi

echo "GitHub Pages artifact ready in $DIST"
