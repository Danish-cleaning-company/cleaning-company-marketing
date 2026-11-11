import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { locations } from "@/content/locations";
import { services } from "@/content/services";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: "2026-11-10",
      changeFrequency: "monthly",
      priority: 1,
    },
    ...services.map((service) => ({
      url: `${siteConfig.url}/services/${service.slug}`,
      lastModified: service.lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...locations.map((location) => ({
      url: location.canonicalUrl,
      lastModified: location.lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${siteConfig.url}/job`,
      lastModified: "2026-11-10",
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteConfig.url}/privatlivspolitik`,
      lastModified: "2026-11-10",
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
