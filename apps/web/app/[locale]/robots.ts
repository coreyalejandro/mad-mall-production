import type { MetadataRoute } from "next";
import { env } from "@/env";

const protocol = env.VERCEL_PROJECT_PRODUCTION_URL?.startsWith("https")
  ? "https"
  : "http";
const baseUrl = env.VERCEL_PROJECT_PRODUCTION_URL
  ? new URL(`${protocol}://${env.VERCEL_PROJECT_PRODUCTION_URL}`)
  : new URL("http://localhost:3000");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: new URL("/sitemap.xml", baseUrl.href).href,
  };
}
