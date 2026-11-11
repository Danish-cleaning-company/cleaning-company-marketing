import { siteConfig } from "@/config/site";

export type ServiceRecord = {
  slug: string;
  name: string;
  title: string;
  description: string;
  canonicalUrl: string;
  lastModified: string;
};

export const services = [
  {
    slug: "institutioner",
    name: "Institutioner",
    title: "Institutionsrengøring i Kolding, Vejle & Haderslev | Kolding Rengøring",
    description:
      "Professionel institutionsrengøring i Kolding, Vejle, Haderslev og Egtved. Stabil rengøring til børnehuse, institutioner og erhverv med høje krav til hygiejne og tryghed.",
    canonicalUrl: `${siteConfig.url}/services/institutioner`,
    lastModified: "2026-11-10",
  },
  {
    slug: "restauranter",
    name: "Restauranter",
    title: "Restaurant Rengøring i Kolding, Vejle & Haderslev | Køkken & Café",
    description:
      "Pålidelig restaurant rengøring i Kolding, Vejle og Haderslev: køkken, spiseområde og toiletter. Fødevarehygiejne i fokus og fleksible tider. Indhent et tilbud.",
    canonicalUrl: `${siteConfig.url}/services/restauranter`,
    lastModified: "2026-11-10",
  },
  {
    slug: "kontor",
    name: "Kontor",
    title: "Kontorrengøring i Kolding | Erhvervsrengøring & Trappevask",
    description:
      "Effektiv kontorrengøring i Kolding: daglig rengøring, desinficering af fællesområder og vinduespudsning. Fleksible aftaler for virksomheder.",
    canonicalUrl: `${siteConfig.url}/services/kontor`,
    lastModified: "2026-11-10",
  },
  {
    slug: "solarium",
    name: "Solcenter",
    title: "Rengøring af Solcentre i Kolding | Kolding Rengøring",
    description:
      "Specialiseret rengøring af solcentre i Kolding. Grundig desinficering og vedligeholdelse af kabiner og udstyr.",
    canonicalUrl: `${siteConfig.url}/services/solarium`,
    lastModified: "2026-11-10",
  },
  {
    slug: "sommerhus",
    name: "Sommerhuse",
    title: "Sommerhusrengøring i Kolding, Vejle & Haderslev | Klargøring af feriebolig",
    description:
      "Sommerhusrengøring i Kolding, Vejle og Haderslev: skiftedagsrengøring, klargøring til gæster, terrasser og vinduer. Fleksible aftaler for ejere og udlejere.",
    canonicalUrl: `${siteConfig.url}/services/sommerhus`,
    lastModified: "2026-11-10",
  },
] as const satisfies readonly ServiceRecord[];

export function getService(slug: string): ServiceRecord | undefined {
  return services.find((service) => service.slug === slug);
}

