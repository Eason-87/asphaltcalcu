import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    throw new Error("site is not defined in astro.config.mjs");
  }

  // 获取所有博客文章
  const posts = await getCollection("blog");

  // 基础页面
  const basePages = [
    {
      url: "",
      lastmod: "2025-06-14",
      changefreq: "monthly",
      priority: "1.0",
    },
    {
      url: "asphalt-driveway-cost",
      lastmod: "2025-06-14",
      changefreq: "monthly",
      priority: "0.9",
    },
    {
      url: "asphalt-tonnage",
      lastmod: "2025-06-14",
      changefreq: "monthly",
      priority: "0.9",
    },
    {
      url: "blog",
      lastmod: "2025-06-14",
      changefreq: "weekly",
      priority: "0.9",
    },
    {
      url: "terms",
      lastmod: "2025-06-14",
    },
    {
      url: "privacy",
      lastmod: "2025-06-14",
    },
  ];

  // 生成博客文章URL
  const blogUrls = posts.map((post) => ({
    url: `blog/${post.slug}`,
    lastmod: post.data.date,
    changefreq: "weekly",
    priority: "0.8",
  }));

  // 合并所有URL
  const allUrls = [...basePages, ...blogUrls];

  // 生成XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (page) => `  <url>
    <loc>${site}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
