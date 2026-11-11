import { siteConfig } from "./site";
import type { ConversionPurpose } from "@/lib/tracking";

export type EnquiryCategory =
  | "salesProspect"
  | "jobCandidate"
  | "existingCustomer"
  | "subcontractor";

export type FormConfiguration = {
  purpose: ConversionPurpose;
  formId: string | null;
  successPath: string | null;
};

export const formConfigurations = {
  salesProspect: {
    purpose: "sales_lead",
    formId: siteConfig.analytics.hubSpotSalesFormId,
    successPath: "/thank-you",
  },
  jobCandidate: {
    purpose: "recruitment_application",
    formId: siteConfig.analytics.hubSpotRecruitmentFormId,
    successPath: "/job-thank-you",
  },
  existingCustomer: {
    purpose: "existing_customer_enquiry",
    formId: null,
    successPath: null,
  },
  subcontractor: {
    purpose: "subcontractor_application",
    formId: null,
    successPath: null,
  },
} as const satisfies Record<EnquiryCategory, FormConfiguration>;

export function getFormConfiguration(purpose: ConversionPurpose) {
  return Object.values(formConfigurations).find((form) => form.purpose === purpose);
}
