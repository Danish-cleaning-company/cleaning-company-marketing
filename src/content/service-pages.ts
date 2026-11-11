export type ServicePackage = {
  name: string;
  price: string;
  priceValue?: number;
  items: readonly string[];
};

export type ServicePageContent = {
  slug: string;
  heading: string;
  intro: string;
  image: string;
  imageAlt: string;
  detailsHeading: string;
  details: readonly string[];
  packagesHeading: string;
  packages?: readonly ServicePackage[];
  beforeAfter?: {
    heading: string;
    before: string;
    after: string;
  };
  partner?: {
    href: string;
    image: string;
    alt: string;
  };
  related: readonly { href: string; label: string }[];
  contactText: string;
  about?: {
    heading: string;
    paragraphs: readonly string[];
  };
};

export const servicePages = [
  {
    slug: "institutioner",
    heading: "Institutionsrengøring i Kolding, Vejle, Haderslev & Egtved",
    intro: "Vi tilbyder stabil og professionel institutionsrengøring til børnehuse, daginstitutioner og virksomheder med høje krav til hygiejne, tryghed og driftssikkerhed. Vi tilpasser rengøringen efter jeres åbningstider, rumtyper og daglige behov.",
    image: "/images/institutioner.webp",
    imageAlt: "Professionel institutionsrengøring i Kolding",
    detailsHeading: "Vores ydelser inkluderer:",
    details: [
      "Daglig rengøring af fællesområder, gange og opholdsrum",
      "Grundig rengøring og desinfektion af toiletter og pusleområder",
      "Støvsugning, gulvvask og aftørring af kontaktflader",
      "Rengøring af kontorer, personalerum og mødelokaler",
      "Affaldshåndtering og genopfyldning efter aftale",
      "Ekstra fokus på hygiejne i rum med børn, borgere eller mange daglige brugere",
    ],
    packagesHeading: "Løsninger til institutioner",
    packages: [
      { name: "Basis – Fast Vedligehold", price: "Efter gennemgang", items: ["Fast rengøring flere gange om ugen", "Toiletter, fællesarealer og kontaktflader", "Støvsugning og gulvvask efter behov", "Affaldshåndtering", "Fast aftalt opgaveplan"] },
      { name: "Standard – Hygiejne Plus", price: "Efter behov og areal", items: ["Alt i Basis", "Ekstra fokus på toiletter og højkontaktsflader", "Rengøring af personalerum og kontorer", "Fleksibel plan efter åbningstider", "Løbende dialog og tilpasning"] },
      { name: "Premium – Institutionsdrift", price: "Fast månedlig aftale", items: ["Alt i Standard", "Daglig rengøring på hverdage", "Rotationsplan for grundigere områder", "Mulighed for ekstra service ved behov", "Fast kvalitetssikring og opfølgning"] },
    ],
    partner: { href: "https://boernehus-syd.dk/", image: "/images/børnehussyd.png", alt: "Børnehus Syd logo" },
    related: [
      { href: "/services/restauranter", label: "Restaurant rengøring" },
      { href: "/services/kontor", label: "Kontorrengøring" },
      { href: "/services/solarium", label: "Solcentre rengøring" },
    ],
    contactText: "Vil du have et tilbud på institutionsrengøring? Send os en besked, så vender vi tilbage hurtigst muligt – typisk samme dag.",
    about: {
      heading: "Institutionsrengøring: stabil rengøring til børnehuse og institutioner",
      paragraphs: [
        "Institutionsrengøring kræver mere end almindelig rengøring. Når mange børn, medarbejdere eller borgere bruger de samme lokaler hver dag, er der behov for en stabil plan, tydelig kommunikation og ekstra fokus på hygiejne. Hos Kolding Rengøring hjælper vi institutioner i Kolding, Vejle, Haderslev og Egtved med faste rengøringsaftaler, der passer til den daglige drift.",
        "Vi kan hjælpe med rengøring af toiletter, fællesrum, kontorer, personalerum, gange og andre områder, hvor renlighed og tryghed er vigtigt. Opgaverne aftales efter gennemgang af lokalerne, så I får en løsning, der matcher jeres behov, åbningstider og krav til kvalitet.",
      ],
    },
  },
  {
    slug: "kontor",
    heading: "Kontorrengøring i Kolding",
    intro: "Skab et rent, sundt og imødekommende arbejdsmiljø. Vi leverer stabil daglig rengøring, desinficering af kontaktflader og fleksible besøg uden for åbningstid.",
    image: "/images/clean-office.webp",
    imageAlt: "Professionel kontorrengøring service til et rent og sundt arbejdsmiljø",
    detailsHeading: "Vores Kontorrengøring",
    details: ["Støvning og aftørring af borde, skærme og fællesarealer", "Støvsugning og gulvvask i kontorer, gange og mødelokaler", "Desinficering af kontaktpunkter (døre, gelændere, tastaturer)", "Toilet- og tekøkkenservice inkl. genopfyldning", "Vinduespudsning indvendigt (udvendigt i Premium)"],
    packagesHeading: "Vores Kontor Pakker",
    packages: [
      { name: "Basis – Standard Kontor", price: "Fra 3.500 kr./md", priceValue: 3500, items: ["Daglig rengøring af kontorområder", "Støvsugning og gulvvask", "Toilet- og fællesrum rengøring"] },
      { name: "Standard – Hygiejne Kontor", price: "Fra 5.500 kr./md", priceValue: 5500, items: ["Alt i Basis", "Vinduespudsning indvendigt 1x/uge", "Desinficering af skriveborde og udstyr"] },
      { name: "Premium – Total Care Kontor", price: "Fra 7.500 kr./md", priceValue: 7500, items: ["Alt i Standard", "Månedlig dybderengøring", "Vinduespudsning indvendigt + udvendigt", "Fleksible aften-/weekendbesøg"] },
    ],
    partner: { href: "https://drone-eksperten.com/", image: "/images/Drone-Eksperten-logo-1.svg", alt: "Drone Eksperten Logo. Kontor rengøring i Kolding" },
    related: [{ href: "/services/restauranter", label: "Restaurant rengøring" }, { href: "/services/solarium", label: "Solcentre rengøring" }],
    contactText: "Har du spørgsmål til vores servicer er du velkommen til at skrive til os. Så kontakter vi dig snarest",
    about: {
      heading: "Kolding Rengøring I/S: Professionel kontorrengøring",
      paragraphs: ["Kontorrengøring er en essentiel service for enhver virksomhed, der ønsker at opretholde et rent og professionelt arbejdsmiljø. Et rent kontor bidrager ikke kun til medarbejdernes trivsel, men det skaber også et positivt indtryk på kunder og besøgende. Hos Kolding Rengøring tilbyder vi skræddersyede løsninger til kontorrengøring, der passer til netop din virksomheds behov. Når man taler om kontorrengøring, er det vigtigt at fokusere på de områder, der ofte overses. Det handler ikke kun om at støvsuge gulvene og tømme skraldespandene. Effektiv kontorrengøring inkluderer også desinfektion af overflader, rengøring af køkkenfaciliteter og grundig støvsugning af møbler. Vores team af professionelle rengøringsfolk er trænet i at håndtere alle aspekter af kontorrengøring, så du kan være sikker på, at dit kontor altid fremstår pænt og indbydende. En af fordelene ved at outsource kontorrengøring er, at det frigiver tid for dine medarbejdere, så de kan fokusere på deres kerneopgaver. Desuden har vi de rette redskaber og rengøringsmidler til at sikre, at rengøringen bliver udført effektivt og grundigt. Vi anvender miljøvenlige produkter, der er skånsomme mod både mennesker og miljø, hvilket er en vigtig faktor for mange virksomheder i dag. Vi tilbyder fleksible rengøringsaftaler, der kan tilpasses dine specifikke behov. Uanset om du har brug for daglig, ugentlig eller månedlig rengøring, kan vi skræddersy en plan, der passer til din virksomhed. Vores mål er at sikre, at dit kontor altid er et behageligt sted at arbejde, hvilket kan øge produktiviteten og medarbejdernes tilfredshed. Kontakt os i dag for at høre mere om vores kontorrengøringstjenester. Vi står klar til at hjælpe dig med at skabe et rent og sundt arbejdsmiljø, der fremmer trivsel og effektivitet. Med Kolding Rengøring kan du være sikker på, at din kontorrengøring er i de bedste hænder."],
    },
  },
  {
    slug: "restauranter",
    heading: "Restaurant Rengøring i Kolding, Vejle, Haderslev & Egtved",
    intro: "Vi tilbyder professionel restaurant rengøring i hele Trekantsområdet. Med fokus på fødevarehygiejne og driftssikkerhed udfører vi daglig rengøring af køkken og gæsteområder. Vi arbejder før/efter åbning, så du kan holde fokus på gæsterne.",
    image: "/images/jason-leung-poI7DelFiVA-unsplash.webp",
    imageAlt: "Restaurant rengøring for en ren og indbydende atmosfære.",
    detailsHeading: "Vores ydelser inkluderer:",
    details: ["Affedtning og desinficering i køkken (borde, greb, udstyr)", "Gulvvask, affald og aftørring i spiseområde og bar", "Toiletter: rengøring, desinfektion og genopfyldning", "Ugentlig dybderengøring/udstyr efter aftale", "Vinduespudsning indvendigt (og udvendigt i Premium)"],
    packagesHeading: "Restaurant rengøringspakker",
    packages: [
      { name: "Basis – Daglig Drift", price: "Fra 8.000 kr./md", priceValue: 8000, items: ["Daglig rengøring af gæsteområde", "Daglig rengøring af køkken", "Daglig rengøring af toiletter", "Affaldshåndtering", "Tilgængelig i alle byer"] },
      { name: "Standard – Hygiejne Plus", price: "Fra 11.500 kr./md", priceValue: 11500, items: ["Alt i Basis", "Ugentlig dybderengøring af køkken", "Vinduespudsning indvendigt 1×/md", "Desinficering af højkontaktsflader", "Fleksibel tidsplan"] },
      { name: "Premium – Total Care", price: "Fra 14.500 kr./md", priceValue: 14500, items: ["Alt i Standard", "Ugentlig grundrengøring (hætter, ovne m.m.)", "Vinduespudsning indvendigt + udvendigt", "Månedlig gulvbehandling", "Ekstra weekend/aftenbesøg", "24/7 support"] },
    ],
    beforeAfter: { heading: "Professionel restaurant rengøring i hele Trekantsområdet", before: "/images/Kitchen_before.webp", after: "/images/Kitchen_after.webp" },
    partner: { href: "https://herefordbeefstouw.dk/", image: "/images/Hereford_logo-removebg-preview.png", alt: "A Hereford Beefstouw logo" },
    related: [{ href: "/services/kontor", label: "Kontorrengøring" }, { href: "/services/solarium", label: "Solcentre rengøring" }],
    contactText: "Har du spørgsmål til vores servicer er du velkommen til at skrive til os. Så kontakter vi dig snarest",
    about: {
      heading: "Restaurant rengøring: Professionel rengøring til din restaurant i Trekantsområdet",
      paragraphs: ["At drive en restaurant kræver ikke kun fokus på mad og service, men også på renlighed og hygiejne. Restaurant rengøring er en essentiel del af driften, der sikrer, at dine gæster får en behagelig oplevelse, og at du overholder de sundhedsmæssige krav. I Kolding, Vejle, Haderslev og Egtved tilbyder vi skræddersyede rengøringsløsninger til restauranter, der imødekommer dine specifikke behov. En ren restaurant er ikke kun vigtig for gæsternes tilfredshed, men også for personalets trivsel. Et rent miljø reducerer risikoen for sygdomme og skaber en mere produktiv arbejdsplads. Vores team af professionelle rengøringsfolk har erfaring med rengøring af restauranter i forskellige størrelser og typer over hele Trekantsområdet. Vi anvender effektive rengøringsmetoder og miljøvenlige produkter, der sikrer, at alle områder af din restaurant bliver grundigt rengjort. Vores restaurant rengøring omfatter alt fra daglig rengøring af spiseområder og køkkener til dybderengøring af gulve, vægge og udstyr. Vi forstår, at hver restaurant har sine egne unikke udfordringer, og derfor tilpasser vi vores tjenester til dine specifikke behov. Uanset om du har brug for en engangsdybderengøring eller regelmæssig vedligeholdelse i Kolding, Vejle, Haderslev eller Egtved, kan vi hjælpe. En vigtig del af vores service er også at sikre, at alle rengøringsopgaver udføres i overensstemmelse med gældende sundheds- og sikkerhedsstandarder. Vi holder os opdateret med de nyeste retningslinjer og anbefalinger, så du kan være sikker på, at din restaurant altid er i overensstemmelse med lovgivningen. Ved at vælge os til din restaurant rengøring, investerer du i et renere og mere indbydende miljø for dine gæster. Kontakt os i dag for at få et uforpligtende tilbud og lad os hjælpe dig med at holde din restaurant skinnende ren."],
    },
  },
  {
    slug: "solarium",
    heading: "Solcentre Rengøring i Kolding",
    intro: "Vi hjælper solcentre i Kolding med daglig, dokumenterbar rengøring og desinficering af kabiner og solbænke. Fokus på hygiejne, sikkerhed og hurtig drift – uden afbrydelser for dine kunder.",
    image: "/images/solarium.webp",
    imageAlt: "Indvendig solarium kabine rengøring",
    detailsHeading: "Vores Solarium Rengøring",
    details: ["Daglig desinficering af solbænke, håndtag og betjeningspaneler", "Rengøring og polering af spejle, glas og akryl", "Gulvvask, skrald og aftørring af kontaktflader i venteområdet", "Opfyldning af papir, desinfektionsmidler og forbrugsvarer", "Ugentlig dybderengøring efter aftale"],
    packagesHeading: "Vores Solarium Pakker",
    packages: [
      { name: "Basis – Daglig Kabine", price: "Fra 7.000 kr./md", priceValue: 7000, items: ["Daglig rengøring af solbænke og kabiner", "Desinficering af alle overflader", "Affaldshåndtering og gulvvask"] },
      { name: "Standard – Hygiejne Sol", price: "Fra 9.000 kr./md", priceValue: 9000, items: ["Alt i Basis", "Vinduespudsning indvendigt 1x/md", "Opfyldning af hygiejneprodukter"] },
      { name: "Premium – Total Solcenter", price: "Fra 11.500 kr./md", priceValue: 11500, items: ["Alt i Standard", "Ugentlig dybderengøring af ventilationsområder", "Vinduespudsning indvendigt + udvendigt", "Månedlig grundrengøring af hele centret"] },
    ],
    related: [{ href: "/services/restauranter", label: "Restaurant rengøring" }, { href: "/services/kontor", label: "Kontorrengøring" }],
    contactText: "Har du spørgsmål til vores solarium rengøring? Skriv til os, så kontakter vi dig snarest.",
  },
  {
    slug: "sommerhus",
    heading: "Sommerhusrengøring i Kolding, Haderslev & Vejle",
    intro: "Sørg for at dine gæster møder et rent og indbydende sommerhus. Vi klarer skiftedagsrengøring, hurtige turnaround-opgaver og løbende vedligehold, så du kan fokusere på udlejningen.",
    image: "/images/Hero-image.webp",
    imageAlt: "Sommerhus rengøring og klargøring til nye gæster",
    detailsHeading: "Vores Sommerhusrengøring",
    details: ["Skiftedagsrengøring af køkken, badeværelser, soveværelse og opholdsrum", "Støvsugning og gulvvask", "Udluftning, affaldshåndtering og opfyldning af basisvarer (efter aftale)", "Sengetøj og tekstilservice efter aftale", "Vinduespudsning på forespørgsel"],
    packagesHeading: "Sommerhusrengøring koster 340 kr. i timen pr. medarbejder inkl. moms.",
    partner: { href: "https://www.novasol.dk/", image: "/images/Novasol.png", alt: "Novasol logo" },
    related: [{ href: "/services/kontor", label: "Kontorrengøring" }, { href: "/services/restauranter", label: "Restaurant rengøring" }],
    contactText: "Har du spørgsmål til vores servicer er du velkommen til at skrive til os. Så kontakter vi dig snarest",
    about: {
      heading: "Sommerhusrengøring: Klar til nye gæster – hver gang",
      paragraphs: ["Vi ved, at en hurtig og grundig klargøring er afgørende, når gæsterne skifter i højsæsonen. Vores team håndterer alt fra sandede gulve til bad og køkken, så dit sommerhus altid står klar. Vi arbejder fleksibelt i Kolding, Vejle og Haderslev, tilbyder både faste skiftedage og ekstra besøg ved høj belægning, og kan inkludere opredning, tekstilservice samt terrasser og vinduer. Med faste rutiner og checklister leverer vi stabile resultater, så du kan fokusere på udlejningen og dine gæsters oplevelse."],
    },
  },
] as const satisfies readonly ServicePageContent[];

export function getServicePage(slug: string): ServicePageContent | undefined {
  return servicePages.find((service) => service.slug === slug);
}
