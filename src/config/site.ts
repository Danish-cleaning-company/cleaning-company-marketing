export const siteConfig = {
  companyName: "Kolding Rengøring",
  legalName: "Kolding Rengøring I/S",
  cvr: "45343111",
  url: "https://kolding-rengoering.dk",
  contact: {
    email: "info@kolding-rengoering.dk",
    phoneDisplay: "+45 91 84 21 49",
    phoneHref: "tel:+4591842149",
  },
  logos: {
    header: "/images/header_logo.png",
    primary: "/images/logo.png",
  },
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61572398937970",
    linkedin: "https://www.linkedin.com/company/106295200",
    instagram: "https://www.instagram.com/rengoeringkolding/",
  },
  analytics: {
    ga4MeasurementId: "G-LWF59KVR0L",
    googleAdsId: "AW-17515658494",
    googleAdsSalesLeadDestination: "AW-17515658494/b_iACLmniaocEP75jqBB",
    metaPixelId: "999143794978535",
    hubSpotPortalId: "146906456",
    hubSpotSalesFormId: "84085022-4b4d-49d6-b5e9-c25a24dd277b",
    hubSpotRecruitmentFormId: "d9b1a805-ecd8-475a-a4ae-806d6c15f4c4",
  },
} as const;

export type SiteConfig = typeof siteConfig;
