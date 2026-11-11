import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LocationPageContent } from "@/components/sections/LocationPageContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";
import { getLocation, locations } from "@/content/locations";

import "../homepage.css";

type LocationPageProps = {
  params: Promise<{ city: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return locations.map(({ slug }) => ({ city: slug }));
}

export async function generateMetadata({
  params,
}: LocationPageProps): Promise<Metadata> {
  const { city: slug } = await params;
  const location = getLocation(slug);

  if (!location) return {};

  return {
    title: { absolute: location.title },
    description: location.description,
    alternates: { canonical: location.canonicalUrl },
    openGraph: {
      title: location.title,
      description: location.description,
      url: location.canonicalUrl,
    },
  };
}

export default async function LocationPage({ params }: LocationPageProps) {
  const { city: slug } = await params;
  const location = getLocation(slug);

  if (!location) notFound();

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.legalName,
    url: location.canonicalUrl,
    telephone: siteConfig.contact.phoneDisplay,
    email: siteConfig.contact.email,
    areaServed: { "@type": "City", name: location.name },
    image: `${siteConfig.url}${siteConfig.logos.primary}`,
  };

  return (
    <>
      <JsonLd data={localBusinessSchema} />
      <LocationPageContent location={location} />
    </>
  );
}
