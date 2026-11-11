import type { Metadata } from "next";

import { ConfirmationPage } from "@/components/sections/ConfirmationPage";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: { absolute: "Tak for din ansøgning | Kolding Rengøring" },
  description: "Tak for din ansøgning til Kolding Rengøring. Vi kontakter relevante kandidater.",
  alternates: { canonical: `${siteConfig.url}/job-thank-you` },
  robots: { index: false, follow: false },
};

export default function JobThankYouPage() {
  return (
    <ConfirmationPage
      title="Tak for din ansøgning!"
      message="Vi kontakter relevante kandidater."
      conversion={{ formId: siteConfig.analytics.hubSpotRecruitmentFormId, purpose: "recruitment_application" }}
    />
  );
}
