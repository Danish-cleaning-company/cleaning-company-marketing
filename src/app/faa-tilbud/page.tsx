import type { Metadata } from "next";

import { FoundationPage } from "@/components/sections/FoundationPage";

export const metadata: Metadata = {
  title: "Få tilbud",
  robots: { index: false, follow: false },
};

export default function QuotePage() {
  return (
    <FoundationPage
      description="Denne rute er kun en teknisk pladsholder og må ikke indekseres endnu."
      eyebrow="Pladsholder"
      title="Få tilbud"
    />
  );
}
