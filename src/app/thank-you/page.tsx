import type { Metadata } from "next";

import { ConfirmationPage } from "@/components/sections/ConfirmationPage";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: { absolute: "Tak for din henvendelse | Kolding Rengøring" },
  description: "Vi har modtaget din besked og vender tilbage hurtigst muligt. Tak fordi du kontaktede Kolding Rengøring.",
  alternates: { canonical: `${siteConfig.url}/thank-you` },
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <ConfirmationPage
      title="Tak for din besked!"
      message="Vi vender tilbage hurtigst muligt."
      conversion={{ formId: siteConfig.analytics.hubSpotSalesFormId, purpose: "sales_lead" }}
    />
  );
}
