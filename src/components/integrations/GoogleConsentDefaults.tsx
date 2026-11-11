import { googleConsentDefaultsScript } from "@/lib/google-consent";

export function GoogleConsentDefaults() {
  return (
    <script
      id="kolding-google-consent-defaults"
      dangerouslySetInnerHTML={{ __html: googleConsentDefaultsScript }}
    />
  );
}
