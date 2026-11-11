import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { siteConfig } from "@/config/site";

import "./privacy-policy.css";

export const metadata: Metadata = {
  title: "Privatlivspolitik",
  description:
    "Læs vores privatlivspolitik for at forstå, hvordan vi håndterer dine data hos Kolding Rengøring.",
  alternates: { canonical: `${siteConfig.url}/privatlivspolitik` },
};

export default function PrivacyPolicyPage() {
  const policyHtml = readFileSync(
    join(process.cwd(), "src/content/privacy-policy.html"),
    "utf8",
  );

  return (
    <main className="privacy-policy">
      <article dangerouslySetInnerHTML={{ __html: policyHtml }} />
    </main>
  );
}
