import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/JsonLd";
import { Homepage } from "@/components/sections/Homepage";
import { siteConfig } from "@/config/site";
import "./homepage.css";

const title = "Erhvervsrengøring i Kolding | Kolding Rengøring";
const description =
  "Professionel erhvervsrengøring i Kolding til restauranter, kontorer, institutioner og solcentre. Fast, stabil og grundig rengøring med fair priser og hurtig respons.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  keywords: [
    "rengøring Kolding",
    "erhvervsrengøring",
    "professionel rengøring",
    "restaurant rengøring",
    "kontor rengøring",
    "rengøringsfirma Kolding",
  ],
  alternates: { canonical: siteConfig.url },
  openGraph: {
    title,
    description,
    url: siteConfig.url,
    type: "website",
    locale: "da_DK",
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: siteConfig.companyName,
          image: `${siteConfig.url}${siteConfig.logos.header}`,
          url: siteConfig.url,
          telephone: siteConfig.contact.phoneDisplay,
          email: siteConfig.contact.email,
          address: {
            "@type": "PostalAddress",
            addressLocality: "Kolding",
            postalCode: "6000",
            addressCountry: "DK",
          },
          priceRange: "DKK",
          description:
            "Kolding Rengøring tilbyder professionel erhvervsrengøring til restauranter, kontorer, institutioner og solcentre i Kolding og omegn.",
          areaServed: { "@type": "Place", name: "Kolding" },
          sameAs: Object.values(siteConfig.social),
        }}
      />
      <Homepage />
    </>
  );
}
