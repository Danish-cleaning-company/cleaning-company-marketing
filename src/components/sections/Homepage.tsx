import Image from "next/image";
import Link from "next/link";

import { ResponsiveImage } from "@/components/ResponsiveImage";
import { HubSpotForm } from "@/components/forms/HubSpotForm";
import { siteConfig } from "@/config/site";
import { InfoCarousel } from "./InfoCarousel";
import { Partners } from "./Partners";

const serviceCards = [
  {
    href: "/services/restauranter",
    title: "Restauranter",
    description: "Daglig erhvervsrengøring til restauranter og caféer i Kolding",
  },
  {
    href: "/services/institutioner",
    title: "Institutioner",
    description: "Stabil og grundig rengøring til institutioner med høje krav til hygiejne og tryghed.",
  },
  {
    href: "/services/kontor",
    title: "Kontor",
    description: "Kontorrengøring og erhvervsrengøring for virksomheder i Kolding",
  },
  {
    href: "/services/solarium",
    title: "Solcenter",
    description: "Grundig rengøring af solarium i Kolding. Vi sikrer hygiejniske og indbydende kabiner, der lever op til dine kunders forventninger.",
  },
] as const;

export function Homepage() {
  return (
    <main>
      <section id="hero" className="hero">
        <div className="hero-overlay">
          <article className="hero-content">
            <Image
              src="/images/Post_9.webp"
              alt="En rengøringsmedarbejder pudser et spejl"
              className="hero-image"
              fill
              priority
              sizes="100vw"
            />
            <h1>Erhvervsrengøring i Kolding</h1>
            <p>Specialiseret erhvervsrengøring til restauranter, kontorer og institutioner i Kolding.</p>
            <div className="hero-btn-container">
              <a href="#contact" className="hero-btn">Få et tilbud inden for 24 timer</a>
              <a href={siteConfig.contact.phoneHref} className="hero-btn secondary">Ring nu</a>
            </div>
          </article>
        </div>
      </section>

      <section id="our-services">
        <h2 className="title">Vores ydelser</h2>
        <div id="services">
          {serviceCards.map((service) => (
            <article className="service-article" key={service.href}>
              <Link href={service.href}>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <Partners />

      <section className="info-section">
        <div className="info-card">
          <div className="info-content">
            <div className="info-tag">Fast erhvervsrengøring i Kolding</div>
            <h2>Rengøring til virksomheder med faste behov</h2>
            <p>
              At holde omgivelserne rene handler ikke kun om udseende – det har en direkte indflydelse på sundhed, trivsel og komfort. Regelmæssig rengøring forbedrer luftkvaliteten, reducerer allergener og skaber et mere produktivt og behageligt miljø.
            </p>
          </div>
        </div>
        <InfoCarousel />
      </section>

      <section className="service-section">
        <div className="service-image">
          <ResponsiveImage
            src="/images/Hereford_floor.webp"
            alt="Rent Restaurant"
            width={1200}
            height={800}
            sizes="(max-width: 768px) 100vw, 1200px"
          />
          <span className="service-tag">Serviceydelser</span>
          <div className="service-content">
            <div className="service-category">Restauranter</div>
            <h2>Daglig rengøring til restauranter fra 8.000 kr. om måneden</h2>
            <Link href="/services/restauranter" className="service-btn">Læs mere <span aria-hidden="true">›</span></Link>
          </div>
        </div>
      </section>

      <section id="pricing">
        <h2 className="title">Priser</h2>
        <p>Vi tilbyder faste månedlige aftaler til virksomheder i Kolding og omegn. Prisen afhænger af areal, frekvens, åbningstider og hygiejnekrav.</p>
        <ul>
          <li>Restaurant- og caférengøring fra 8.000 kr./md.</li>
          <li>Kontorrengøring efter fast aftale</li>
          <li>Institutionsrengøring efter gennemgang og behov</li>
        </ul>
        <a href="#contact" className="pricing-btn">Få et uforpligtende tilbud</a>
      </section>

      <section id="contact">
        <h2 className="title">Kontakt os</h2>
        <p>Vil du have et tilbud på erhvervsrengøring? Send os en besked, så vender vi tilbage hurtigst muligt – typisk samme dag.</p>
        <HubSpotForm
          className="hs-form-frame"
          portalId={siteConfig.analytics.hubSpotPortalId}
          formId={siteConfig.analytics.hubSpotSalesFormId}
          purpose="sales_lead"
        />
      </section>

      <section id="reviews">
        <h2 className="title">Hvad siger vores kunder?</h2>
        <div className="reviews-container">
          <div className="review-card" id="ruben-review">
            <blockquote>“God rengøring, stabilt.”</blockquote>
            <p className="review-name">– Ruben</p>
          </div>
          <div className="review-card">
            <blockquote>“Meget professionel rengøring. Yderst tilfreds med deres service 🌞🌞🌞🌞🌞”</blockquote>
            <p className="review-name">– Per</p>
          </div>
          <div className="review-card">
            <blockquote>“Virkelig effektive og enormt omhyggelig rengøring, kan klart anbefales 😊”</blockquote>
            <p className="review-name">– Charlotte</p>
          </div>
        </div>
      </section>

      <section id="about">
        <h2>Kolding Rengøring I/S: Professionel erhvervsrengøring i Kolding</h2>
        <p>Kolding Rengøring hjælper lokale virksomheder med fast og pålidelig rengøring. Vi arbejder især med restauranter, kontorer, institutioner og solcentre, hvor stabilitet, hygiejne og kvalitet er afgørende.</p>
        <p>Vi tilbyder faste aftaler, tydelig kommunikation og fleksible løsninger, så rengøringen passer til virksomhedens åbningstider og behov.</p>
      </section>

      <a href={siteConfig.contact.phoneHref} className="call-fab" aria-label="Ring til os">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.2 1.3.4 2.7.7 4.1.7.7 0 1.3.6 1.3 1.3v3.7c0 .7-.6 1.3-1.3 1.3C10.4 22 2 13.6 2 3.3 2 2.6 2.6 2 3.3 2H7c.7 0 1.3.6 1.3 1.3 0 1.4.2 2.8.7 4.1.1.4 0 .9-.3 1.2l-2.1 2.2Z" /></svg>
      </a>
    </main>
  );
}
