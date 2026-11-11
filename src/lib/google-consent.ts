export const googleConsentDefaultsScript = `
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function gtag(){window.dataLayer.push(arguments);};
if (!window.__koldingGoogleConsentDefaultSet) {
  window.__koldingGoogleConsentDefaultSet = true;
  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied"
  });
}
`;
