var __name = (target, value) => {
  try {
    Object.defineProperty(target, "name", { value, configurable: true });
  } catch (e) {}
  return target;
};
import * as _reactrouter from "@tanstack/react-router";

const BASE_URL = "";
    const Route = _reactrouter.createFileRoute("/sitemap.xml")({
      server: {
        handlers: {
          GET: /* @__PURE__ */ __name(async () => {
            const entries = [
              { path: "/", changefreq: "weekly", priority: "1.0" },
              { path: "/login", changefreq: "monthly", priority: "0.5" },
              { path: "/register", changefreq: "monthly", priority: "0.6" }
            ];
            const urls = entries.map(
              (e) => [
                `  <url>`,
                `    <loc>${BASE_URL}${e.path}</loc>`,
                e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
                e.priority ? `    <priority>${e.priority}</priority>` : null,
                `  </url>`
              ].filter(Boolean).join("\n")
            );
            const xml = [
              `<?xml version="1.0" encoding="UTF-8"?>`,
              `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
              ...urls,
              `</urlset>`
            ].join("\n");
            return new Response(xml, {
              headers: {
                "Content-Type": "application/xml",
                "Cache-Control": "public, max-age=3600"
              }
            });
          }, "GET")
        }
      }
    });
export { Route };
