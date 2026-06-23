import fs from "node:fs";
import { blog, legal } from "@repo/cms";
import type { MetadataRoute } from "next";
import { env } from "@/env";

const appFolders = fs.readdirSync("app", { withFileTypes: true });
const pages = appFolders
  .filter((file) => file.isDirectory())
  .filter((folder) => !folder.name.startsWith("_"))
  .filter((folder) => !folder.name.startsWith("("))
  .map((folder) => folder.name);

// Gracefully degrade when BASEHUB_TOKEN is absent (e.g. local builds without CMS creds)
let blogs: string[] = [];
let legals: string[] = [];
try {
  blogs = (await blog.getPosts()).map((post) => post._slug);
} catch {
  // no token — sitemap will omit blog entries
}
try {
  legals = (await legal.getPosts()).map((post) => post._slug);
} catch {
  // no token — sitemap will omit legal entries
}

const protocol = env.VERCEL_PROJECT_PRODUCTION_URL?.startsWith("https")
  ? "https"
  : "http";
const baseUrl = env.VERCEL_PROJECT_PRODUCTION_URL
  ? new URL(`${protocol}://${env.VERCEL_PROJECT_PRODUCTION_URL}`)
  : new URL("http://localhost:3000");

const sitemap = async (): Promise<MetadataRoute.Sitemap> => [
  {
    url: new URL("/", baseUrl).href,
    lastModified: new Date(),
  },
  ...pages.map((page) => ({
    url: new URL(page, baseUrl).href,
    lastModified: new Date(),
  })),
  ...blogs.map((slug) => ({
    url: new URL(`blog/${slug}`, baseUrl).href,
    lastModified: new Date(),
  })),
  ...legals.map((slug) => ({
    url: new URL(`legal/${slug}`, baseUrl).href,
    lastModified: new Date(),
  })),
];

export default sitemap;
