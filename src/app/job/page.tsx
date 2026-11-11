import type { Metadata } from "next";

import { HubSpotForm } from "@/components/forms/HubSpotForm";
import { siteConfig } from "@/config/site";

import "./job.css";

export const metadata: Metadata = {
  title: { absolute: "Job hos Kolding Rengøring" },
  description: "Vi søger pålidelige og engagerede rengøringsassistenter til deltidsarbejde i Kolding og omegn.",
  alternates: { canonical: `${siteConfig.url}/job` },
  openGraph: {
    title: "Job hos Kolding Rengøring",
    description: "Vi søger pålidelige og engagerede rengøringsassistenter til deltidsarbejde i Kolding og omegn.",
    url: `${siteConfig.url}/job`,
  },
};

export default function JobPage() {
  return (
    <main id="job-content" className="job-page">
      <section className="job-intro" aria-labelledby="job-title">
        <p className="job-eyebrow">KARRIERE · KOLDING RENGØRING</p>
        <h1 id="job-title">Bliv en del af vores team</h1>
        <p className="job-lead">Vi søger pålidelige og engagerede rengøringsassistenter til deltidsarbejde i Kolding og omegn.</p>
        <ul className="job-details" aria-label="Praktiske oplysninger">
          <li>Deltid</li>
          <li>Hverdag / Weekend</li>
          <li>Kørekort kræves</li>
        </ul>
      </section>
      <section className="job-application-intro" aria-labelledby="application-title">
        <h2 id="application-title">Send din ansøgning</h2>
        <p>Udfyld formularen nedenfor, og vedhæft dit CV. Vi kontakter relevante kandidater.</p>
      </section>
      <HubSpotForm className="hs-form-frame job-form-placeholder" portalId={siteConfig.analytics.hubSpotPortalId} formId={siteConfig.analytics.hubSpotRecruitmentFormId} purpose="recruitment_application" />
    </main>
  );
}
