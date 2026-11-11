import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ServicePageContent } from "@/components/sections/ServicePageContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";
import { getServicePage } from "@/content/service-pages";
import { getService, services } from "@/content/services";

import "../service-pages.css";

type ServicePageProps = {
  params: Promise<{ service: string }>;
};

export function generateStaticParams() {
  return services.map(({ slug }) => ({ service: slug }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { service: slug } = await params;
  const service = getService(slug);

  if (!service) return {};

  return {
    title: { absolute: service.title },
    description: service.description,
    alternates: { canonical: service.canonicalUrl },
    openGraph: {
      title: service.title,
      description: service.description,
      url: service.canonicalUrl,
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { service: slug } = await params;
  const service = getService(slug);
  const content = getServicePage(slug);

  if (!service || !content) notFound();

  const offers = content.packages
    ?.filter((item) => item.priceValue !== undefined)
    .map((item) => ({
      "@type": "Offer",
      name: item.name,
      priceCurrency: "DKK",
      price: item.priceValue,
      url: `${service.canonicalUrl}#packages`,
    }));

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: content.heading,
    description: service.description,
    url: service.canonicalUrl,
    provider: {
      "@type": "LocalBusiness",
      name: siteConfig.legalName,
      url: siteConfig.url,
      telephone: siteConfig.contact.phoneDisplay,
      email: siteConfig.contact.email,
    },
    ...(offers?.length
      ? { hasOfferCatalog: { "@type": "OfferCatalog", name: content.packagesHeading, itemListElement: offers } }
      : {}),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Forside", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: service.name, item: service.canonicalUrl },
    ],
  };

  return (
    <>
      <JsonLd data={[serviceSchema, breadcrumbSchema]} />
      <ServicePageContent service={content} />
    </>
  );
}
