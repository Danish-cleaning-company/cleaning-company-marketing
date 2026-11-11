import Image from "next/image";
import Link from "next/link";

import { HubSpotForm } from "@/components/forms/HubSpotForm";
import { siteConfig } from "@/config/site";
import type { LocationRecord } from "@/content/locations";
import { InfoCarousel } from "./InfoCarousel";
import { Partners } from "./Partners";

const features = [
  { title: "Erfarent team", text: "Erfaring og kvalitet i hver rengøring." },
  { title: "Kvalitetsservice", text: "Vi går ikke, før det skinner." },
  { title: "Overkommelige priser", text: "Transparent prissætning uden skjulte gebyrer." },
] as const;

export function LocationPageContent({ location }: { location: LocationRecord }) {
  const serviceCards = [
    { href: "/services/restauranter", title: "Restauranter", text: `Daglig erhvervsrengøring til restauranter og caféer i ${location.name}` },
    { href: "/services/institutioner", title: "Institutioner", text: "Stabil og grundig rengøring til institutioner med høje krav til hygiejne og tryghed." },
    { href: "/services/kontor", title: "Kontor", text: `Kontorrengøring og erhvervsrengøring for virksomheder i ${location.name}` },
    { href: "/services/solarium", title: "Solcenter", text: `Grundig rengøring af solarium i ${location.name}. Vi sikrer hygiejniske og indbydende kabiner, der lever op til dine kunders forventninger.` },
  ];

  return (
    <main>
      <section id="hero" className="hero">
        <div className="hero-overlay">
          <article className="hero-content">
            <Image src="/images/Post_9.webp" alt="En rengøringsmedarbejder pudser et spejl" className="hero-image" fill priority sizes="100vw" />
            <h1>Erhvervsrengøring i {location.name}</h1>
            <p>{location.heroDescription}</p>
          </article>
        </div>
      </section>

      <section className="hero-cards-section" aria-label="Fordele">
        <div className="hero-cards">
          {features.map((feature) => <article className="hero-card" key={feature.title}><h2>{feature.title}</h2><p>{feature.text}</p></article>)}
        </div>
      </section>

      <Partners />

      <section className="info-section">
        <div className="info-card"><div className="info-content">
          <div className="info-tag">Fast erhvervsrengøring i Kolding</div>
          <h2>Rengøring til virksomheder med faste behov</h2>
          <p>At holde omgivelserne rene handler ikke kun om udseende – det har en direkte indflydelse på sundhed, trivsel og komfort. Regelmæssig rengøring forbedrer luftkvaliteten, reducerer allergener og skaber et mere produktivt og behageligt miljø.</p>
        </div></div>
        <InfoCarousel city={location.name} />
      </section>

      <section id="our-services">
        <h2 className="title">Vores ydelser</h2>
        <div id="services">
          {serviceCards.map((service) => <article className="service-article" key={service.href}><Link href={service.href}><h3>{service.title}</h3><p>{service.text}</p></Link></article>)}
        </div>
      </section>

      <section id="pricing">
        <h2 className="title">Priser</h2>
        <p>Vi tilbyder faste månedlige aftaler til virksomheder i Kolding og omegn. Prisen afhænger af areal, frekvens, åbningstider og hygiejnekrav.</p>
        <ul><li>Restaurant- og caférengøring fra 8.000 kr./md.</li><li>Kontorrengøring efter fast aftale</li><li>Institutionsrengøring efter gennemgang og behov</li></ul>
        <a href="#contact" className="pricing-btn">Få et uforpligtende tilbud</a>
      </section>

      <section id="reviews">
        <h2 className="title">Hvad siger vores kunder?</h2>
        <div className="reviews-container">
          <div className="review-card"><blockquote>“God rengøring, stabilt.”</blockquote><p className="review-name">– Ruben</p></div>
          <div className="review-card"><blockquote>“Meget professionel rengøring. Yderst tilfreds med deres service 🌞🌞🌞🌞🌞”</blockquote><p className="review-name">– Per</p></div>
          <div className="review-card"><blockquote>“Virkelig effektive og enormt omhyggelig rengøring, kan klart anbefales 😊”</blockquote><p className="review-name">– Charlotte</p></div>
        </div>
      </section>

      <section id="contact">
        <h2 className="title">Kontakt os</h2>
        <p>Har du spørgsmål til vores servicer er du velkommen til at skrive til os. Så kontakter vi dig snarest</p>
        <HubSpotForm className="hs-form-frame" portalId={siteConfig.analytics.hubSpotPortalId} formId={siteConfig.analytics.hubSpotSalesFormId} purpose="sales_lead" />
      </section>

      <section id="about"><h2>{location.aboutHeading}</h2><p>{location.aboutText}</p></section>
    </main>
  );
}
