import Link from "next/link";

import { ConversionConfirmation } from "@/components/integrations/ConversionConfirmation";
import type { ConversionPurpose } from "@/lib/tracking";
import styles from "./ConfirmationPage.module.css";

export function ConfirmationPage({
  title,
  message,
  conversion,
}: {
  title: string;
  message: string;
  conversion: { formId: string; purpose: ConversionPurpose };
}) {
  return (
    <>
      <ConversionConfirmation {...conversion} />
      <main className={styles.confirmation}>
        <h1>{title}</h1>
        <p>{message}</p>
        <Link className={styles.link} href="/">Tilbage til forsiden</Link>
      </main>
    </>
  );
}
