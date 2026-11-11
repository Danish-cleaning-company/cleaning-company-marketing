import { siteConfig } from "@/config/site";

export type LocationRecord = {
  slug: string;
  name: string;
  title: string;
  description: string;
  canonicalUrl: string;
  lastModified: string;
  heroDescription: string;
  aboutHeading: string;
  aboutText: string;
};

export const reservedRootRoutes = [
  "job",
  "kontakt",
  "faa-tilbud",
  "privatlivspolitik",
  "thank-you",
  "job-thank-you",
  "services",
  "robots.txt",
  "sitemap.xml",
] as const;

export const locations = [
  {
    slug: "egtved",
    name: "Egtved",
    title: "Erhvervsrengøring i Egtved | Kolding Rengøring",
    description:
      "Søger du erhvervsrengøring i Egtved? Kolding Rengøring tilbyder daglig og ugentlig rengøring til virksomheder, restauranter og kontorer – altid til fair priser.",
    canonicalUrl: `${siteConfig.url}/egtved`,
    lastModified: "2026-11-10",
    heroDescription: "Specialiseret erhvervsrengøring til restauranter, kontorer og institutioner i Egtved.",
    aboutHeading: "Rengøring i Egtved: Professionel Rengøringsservice til Dine Behov",
    aboutText: "Når det kommer til rengøring i Egtved, er det vigtigt at vælge en pålidelig og professionel rengøringsservice, der kan imødekomme dine specifikke behov. Uanset om du har brug for rengøring af dit hjem, kontor eller en kommerciel ejendom, kan vores team i Kolding Rengøring tilbyde skræddersyede løsninger, der sikrer et rent og sundt miljø. Vores rengøringstjenester i Egtved omfatter en bred vifte af ydelser, herunder daglig rengøring, dybderengøring, vinduespudsning og specialiseret rengøring af erhvervslokaler. Vi forstår, at hver kunde har unikke krav, og derfor tilpasser vi vores tjenester for at sikre, at du får den bedste oplevelse. En af de største fordele ved at vælge vores rengøringstjenester i Egtved er, at vi anvender miljøvenlige rengøringsmidler og moderne udstyr. Dette sikrer ikke kun et effektivt rengøringsresultat, men også et sundere indeklima for dig og dine medarbejdere. Vores team er trænet i de nyeste rengøringsmetoder og teknikker, hvilket gør os i stand til at levere en høj standard af rengøring hver gang. Vi tilbyder også fleksible rengøringsaftaler, så du kan vælge det tidsrum, der passer bedst til dig. Uanset om du har brug for rengøring dagligt, ugentligt eller månedligt, kan vi tilpasse vores service til dine behov. Vores mål er at gøre rengøring til en bekymringsfri opgave, så du kan fokusere på det, der virkelig betyder noget for dig. Kunder i Egtved har rost vores service for vores pålidelighed, effektivitet og opmærksomhed på detaljer. Vi stræber efter at opbygge langvarige relationer med vores kunder, og vi er stolte af at være en betroet partner i rengøringsbranchen. Hvis du leder efter professionel rengøring i Egtved, er du kommet til det rette sted. Kontakt os i dag for at få et uforpligtende tilbud, og lad os hjælpe dig med at skabe et rent, trygt og indbydende miljø, hvor du kan fokusere på det, der betyder mest for dig.",
  },
  {
    slug: "haderslev",
    name: "Haderslev",
    title: "Erhvervsrengøring i Haderslev | Kolding Rengøring",
    description:
      "Søger du erhvervsrengøring i Haderslev? Kolding Rengøring tilbyder daglig og ugentlig rengøring til virksomheder, restauranter og kontorer – altid til fair priser.",
    canonicalUrl: `${siteConfig.url}/haderslev`,
    lastModified: "2026-11-10",
    heroDescription: "Specialiseret erhvervsrengøring til restauranter, sommerhuse og institutioner i Haderslev.",
    aboutHeading: "Rengøring i Haderslev: Professionel Rengøringsservice til Dine Behov",
    aboutText: "Når det kommer til rengøring i Haderslev, er det vigtigt at vælge en pålidelig og professionel rengøringsservice, der kan imødekomme dine specifikke behov. Uanset om du har brug for rengøring af dit hjem, kontor eller en kommerciel ejendom, kan vores team i Kolding Rengøring tilbyde skræddersyede løsninger, der sikrer et rent og sundt miljø. Vores rengøringstjenester i Haderslev omfatter en bred vifte af ydelser, herunder daglig rengøring, dybderengøring, vinduespudsning og specialiseret rengøring af erhvervslokaler. Vi forstår, at hver kunde har unikke krav, og derfor tilpasser vi vores tjenester for at sikre, at du får den bedste oplevelse. En af de største fordele ved at vælge vores rengøringstjenester i Haderslev er, at vi anvender miljøvenlige rengøringsmidler og moderne udstyr. Dette sikrer ikke kun et effektivt rengøringsresultat, men også et sundere indeklima for dig og dine medarbejdere. Vores team er trænet i de nyeste rengøringsmetoder og teknikker, hvilket gør os i stand til at levere en høj standard af rengøring hver gang. Vi tilbyder også fleksible rengøringsaftaler, så du kan vælge det tidsrum, der passer bedst til dig. Uanset om du har brug for rengøring dagligt, ugentligt eller månedligt, kan vi tilpasse vores service til dine behov. Vores mål er at gøre rengøring til en bekymringsfri opgave, så du kan fokusere på det, der virkelig betyder noget for dig. Kunder i Haderslev har rost vores service for vores pålidelighed, effektivitet og opmærksomhed på detaljer. Vi stræber efter at opbygge langvarige relationer med vores kunder, og vi er stolte af at være en betroet partner i rengøringsbranchen. Hvis du leder efter professionel rengøring i Haderslev, er du kommet til det rette sted. Kontakt os i dag for at få et uforpligtende tilbud, og lad os hjælpe dig med at skabe et rent, trygt og indbydende miljø, hvor du kan fokusere på det, der betyder mest for dig.",
  },
  {
    slug: "vejle",
    name: "Vejle",
    title: "Erhvervsrengøring i Vejle | Kolding Rengøring",
    description:
      "Søger du erhvervsrengøring i Vejle? Kolding Rengøring tilbyder daglig og ugentlig rengøring til virksomheder, restauranter og kontorer – altid til fair priser.",
    canonicalUrl: `${siteConfig.url}/vejle`,
    lastModified: "2026-11-10",
    heroDescription: "Specialiseret erhvervsrengøring til restauranter, kontorer og institutioner i Vejle.",
    aboutHeading: "Rengøring i Vejle: Professionel Rengøringsservice til Dine Behov",
    aboutText: "Når det kommer til rengøring i Vejle, er det vigtigt at vælge en pålidelig og professionel rengøringsservice, der kan imødekomme dine specifikke behov. Uanset om du har brug for rengøring af dit hjem, kontor eller en kommerciel ejendom, kan vores team i Kolding Rengøring tilbyde skræddersyede løsninger, der sikrer et rent og sundt miljø. Vores rengøringstjenester i Vejle omfatter en bred vifte af ydelser, herunder daglig rengøring, dybderengøring, vinduespudsning og specialiseret rengøring af erhvervslokaler. Vi forstår, at hver kunde har unikke krav, og derfor tilpasser vi vores tjenester for at sikre, at du får den bedste oplevelse. En af de største fordele ved at vælge vores rengøringstjenester i Vejle er, at vi anvender miljøvenlige rengøringsmidler og moderne udstyr. Dette sikrer ikke kun et effektivt rengøringsresultat, men også et sundere indeklima for dig og dine medarbejdere. Vores team er trænet i de nyeste rengøringsmetoder og teknikker, hvilket gør os i stand til at levere en høj standard af rengøring hver gang. Vi tilbyder også fleksible rengøringsaftaler, så du kan vælge det tidsrum, der passer bedst til dig. Uanset om du har brug for rengøring dagligt, ugentligt eller månedligt, kan vi tilpasse vores service til dine behov. Vores mål er at gøre rengøring til en bekymringsfri opgave, så du kan fokusere på det, der virkelig betyder noget for dig. Kunder i Vejle har rost vores service for vores pålidelighed, effektivitet og opmærksomhed på detaljer. Vi stræber efter at opbygge langvarige relationer med vores kunder, og vi er stolte af at være en betroet partner i rengøringsbranchen. Hvis du leder efter professionel rengøring i Vejle, er du kommet til det rette sted. Kontakt os i dag for at få et uforpligtende tilbud, og lad os hjælpe dig med at skabe et rent, trygt og indbydende miljø, hvor du kan fokusere på det, der betyder mest for dig.",
  },
] as const satisfies readonly LocationRecord[];

const reservedRoutes = new Set<string>(reservedRootRoutes);
const conflictingLocation = locations.find(({ slug }) => reservedRoutes.has(slug));

if (conflictingLocation) {
  throw new Error(`Location slug conflicts with a static route: ${conflictingLocation.slug}`);
}

export function getLocation(slug: string): LocationRecord | undefined {
  return locations.find((location) => location.slug === slug);
}

