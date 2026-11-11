import Image from "next/image";

const partners = [
  { name: "Hereford", src: "/images/Hereford_logo-removebg-preview.png", href: undefined },
  { name: "Drone Eksperten", src: "/images/Drone-Eksperten-logo-1.svg", href: "https://drone-eksperten.com/" },
  { name: "Dalgas", src: "/images/dalgas_logo.png", href: "https://dalgas.com/en-gb" },
  { name: "Kolding Kommune", src: "/images/KoldingKommune.png", href: "https://www.kolding.dk/" },
  { name: "Odense Kommune", src: "/images/OdenseKommune.png", href: "https://www.odense.dk/" },
  { name: "Børnehus Syd", src: "/images/børnehussyd.png", href: "https://boernehus-syd.dk/" },
  { name: "Novasol", src: "/images/Novasol.png", href: "https://www.novasol.dk/" },
] as const;

type PartnerListProps = { duplicate?: boolean };

function PartnerList({ duplicate = false }: PartnerListProps) {
  return (
    <div className="partner-logos" aria-hidden={duplicate || undefined}>
      {partners.map((partner) => {
        const logo = (
          <Image
            className="partner-logo"
            src={partner.src}
            alt={duplicate ? "" : `${partner.name} logo`}
            width={220}
            height={90}
          />
        );

        return partner.href ? (
          <a
            href={partner.href}
            key={partner.name}
            target="_blank"
            rel="noreferrer"
            tabIndex={duplicate ? -1 : undefined}
          >
            {logo}
          </a>
        ) : (
          <span key={partner.name}>{logo}</span>
        );
      })}
    </div>
  );
}

export function Partners() {
  return (
    <section className="partners">
      <h2 className="title">Vi samarbejder med</h2>
      <div className="partner-carousel is-ready" aria-label="Samarbejdspartnere">
        <div className="partner-carousel-track">
          <PartnerList duplicate />
          <PartnerList />
        </div>
      </div>
    </section>
  );
}
