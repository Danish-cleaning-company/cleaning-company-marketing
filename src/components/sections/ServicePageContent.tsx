import Image from "next/image";
import Link from "next/link";

import { ResponsiveImage } from "@/components/ResponsiveImage";
import { HubSpotForm } from "@/components/forms/HubSpotForm";
import { BeforeAfterGallery } from "@/components/sections/BeforeAfterGallery";
import { siteConfig } from "@/config/site";
import type { ServicePageContent as ServicePageContentType } from "@/content/service-pages";

export function ServicePageContent({ service }: { service: ServicePageContentType }) {
  return (
    <main>
      <section id="our-services">
        <div className="service-header">
          <h1>{service.heading}</h1>
          <p>{service.intro}</p>
        </div>
        <div className="service-description">
          <div className="service-image">
            <ResponsiveImage
              src={service.image}
              alt={service.imageAlt}
              width={600}
              height={400}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="service-details">
            <h2>{service.detailsHeading}</h2>
            <ul>{service.details.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
      </section>

      {service.beforeAfter ? (
        <BeforeAfterGallery
          heading={service.beforeAfter.heading}
          images={[
            { src: service.beforeAfter.before, alt: "Før rengøring af restaurant", label: "Før" },
            { src: service.beforeAfter.after, alt: "Efter rengøring af restaurant", label: "Efter" },
          ]}
        />
      ) : null}

      <section id="packages">
        <h2 className="title">{service.packagesHeading}</h2>
        {service.packages ? (
          <div className="packages-container">
            {service.packages.map((servicePackage) => (
              <article className="package-card" key={servicePackage.name}>
                <h3>{servicePackage.name}</h3>
                <p className="price">{servicePackage.price}</p>
                <ul>{servicePackage.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      {service.partner ? (
        <section className="partners">
          <h2 className="title">Vi samarbejder med</h2>
          <div className="partner-logos">
            <a href={service.partner.href} target="_blank" rel="noreferrer">
              <Image className="partner-logo" src={service.partner.image} alt={service.partner.alt} width={500} height={120} />
            </a>
          </div>
        </section>
      ) : null}

      <section id="related-services" className="related">
        <h2>Relaterede ydelser</h2>
        <ul>{service.related.map((item) => <li key={item.href}><Link href={item.href}>{item.label}</Link></li>)}</ul>
      </section>

      <section id="contact">
        <h2 className="title">Kontakt os</h2>
        <p>{service.contactText}</p>
        <HubSpotForm className="hs-form-frame" portalId={siteConfig.analytics.hubSpotPortalId} formId={siteConfig.analytics.hubSpotSalesFormId} purpose="sales_lead" />
      </section>

      {service.about ? (
        <section id="about">
          <h2>{service.about.heading}</h2>
          {service.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>
      ) : null}
    </main>
  );
}
