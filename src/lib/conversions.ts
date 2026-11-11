import type { ConversionPurpose } from "./tracking";

export const conversionMarkerLifetimeMs = 30 * 60 * 1000;

export type SubmissionMarker = {
  eventId: string;
  formId: string;
  purpose: ConversionPurpose;
  createdAt: number;
};

export type ConversionRequest = Pick<SubmissionMarker, "eventId" | "formId" | "purpose">;

export function conversionMarkerKey(purpose: ConversionPurpose) {
  return `kolding:confirmed-submission:${purpose}`;
}

export function createSubmissionMarker(
  purpose: ConversionPurpose,
  formId: string,
  eventId: string,
  createdAt = Date.now(),
): SubmissionMarker {
  return { purpose, formId, eventId, createdAt };
}

export function isValidSubmissionMarker(
  value: unknown,
  expectedPurpose: ConversionPurpose,
  expectedFormId: string,
  now = Date.now(),
): value is SubmissionMarker {
  if (!value || typeof value !== "object") return false;

  const marker = value as Partial<SubmissionMarker>;
  const age = typeof marker.createdAt === "number" ? now - marker.createdAt : Number.NaN;

  return marker.purpose === expectedPurpose
    && marker.formId === expectedFormId
    && typeof marker.eventId === "string"
    && marker.eventId.length > 0
    && Number.isFinite(age)
    && age >= 0
    && age <= conversionMarkerLifetimeMs;
}

export function conversionChannels(purpose: ConversionPurpose) {
  if (purpose === "sales_lead") {
    return { metaStandardEvent: "Lead", googleAds: true } as const;
  }

  if (purpose === "recruitment_application") {
    return { metaCustomEvent: "RecruitmentApplication", googleAds: false } as const;
  }

  return { googleAds: false } as const;
}
