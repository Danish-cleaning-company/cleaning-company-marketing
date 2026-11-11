"use client";

import { useEffect } from "react";

import { conversionMarkerKey, isValidSubmissionMarker } from "@/lib/conversions";
import { queueConversion } from "@/lib/tracking-client";
import type { ConversionPurpose } from "@/lib/tracking";

export function ConversionConfirmation({
  formId,
  purpose,
}: {
  formId: string;
  purpose: ConversionPurpose;
}) {
  useEffect(() => {
    const key = conversionMarkerKey(purpose);
    let value: unknown;

    try {
      const stored = window.sessionStorage.getItem(key);
      window.sessionStorage.removeItem(key);
      value = stored ? JSON.parse(stored) : null;
    } catch {
      value = null;
    }

    if (!isValidSubmissionMarker(value, purpose, formId)) {
      if (["localhost", "127.0.0.1", "::1"].includes(window.location.hostname)) {
        console.info("[Kolding Tracking] No valid confirmed-submission marker; conversion skipped.", { purpose });
      }
      return;
    }

    queueConversion({ purpose, formId, eventId: value.eventId });
  }, [formId, purpose]);

  return null;
}
