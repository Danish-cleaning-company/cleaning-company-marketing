export const conversionPurposes = [
  "sales_lead",
  "recruitment_application",
  "existing_customer_enquiry",
  "subcontractor_application",
] as const;

export type ConversionPurpose = (typeof conversionPurposes)[number];

export type TrackingConsent = {
  analytics: boolean;
  advertising: boolean;
};

export type ConversionEvent = {
  purpose: ConversionPurpose;
  eventId?: string;
};
