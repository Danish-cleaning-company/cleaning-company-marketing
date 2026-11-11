"use client";

import { useEffect, useRef, useState } from "react";

import { getFormConfiguration } from "@/config/forms";
import { conversionMarkerKey, createSubmissionMarker } from "@/lib/conversions";
import type { ConversionPurpose } from "@/lib/tracking";

type HubSpotFormProps = {
  portalId: string;
  formId: string;
  purpose: ConversionPurpose;
  className?: string;
};

type HubSpotSubmissionEvent = Event & {
  detail?: { formId?: string; instanceId?: string };
};

declare global {
  interface Window {
    HubSpotFormsV4?: {
      getFormFromEvent: (event: Event) => { getRedirectUrl?: () => string } | undefined;
    };
  }
}

let formScriptPromise: Promise<void> | null = null;

function loadHubSpotFormsScript(portalId: string) {
  if (formScriptPromise) return formScriptPromise;

  formScriptPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById("hubspot-forms-embed") as HTMLScriptElement | null;
    if (existing) {
      if (existing.dataset.loaded === "true") resolve();
      else {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(new Error("HubSpot forms script failed to load.")), { once: true });
      }
      return;
    }

    const script = document.createElement("script");
    script.id = "hubspot-forms-embed";
    script.defer = true;
    script.src = `https://js-eu1.hsforms.net/forms/embed/${portalId}.js`;
    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      resolve();
    }, { once: true });
    script.addEventListener("error", () => {
      formScriptPromise = null;
      reject(new Error("HubSpot forms script failed to load."));
    }, { once: true });
    document.body.appendChild(script);
  });

  return formScriptPromise;
}

function createEventId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function diagnosticsEnabled() {
  return ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname)
    || new URLSearchParams(window.location.search).has("kr-debug");
}

function summarizeRedirect(value?: string) {
  if (!value) return undefined;
  try {
    const redirectUrl = new URL(value, window.location.origin);
    return { origin: redirectUrl.origin, pathname: redirectUrl.pathname };
  } catch {
    return { invalid: true };
  }
}

export function HubSpotForm({
  portalId,
  formId,
  purpose,
  className,
}: HubSpotFormProps) {
  const redirectStarted = useRef(false);
  const instanceId = useRef<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const matchesFormInstance = (event: HubSpotSubmissionEvent) => {
      if (event.detail?.formId !== formId) return false;
      return !instanceId.current || !event.detail.instanceId || event.detail.instanceId === instanceId.current;
    };

    const onFormReady = (event: Event) => {
      const formEvent = event as HubSpotSubmissionEvent;
      if (formEvent.detail?.formId !== formId) return;
      instanceId.current = formEvent.detail.instanceId || null;
      setErrorMessage(null);
      if (diagnosticsEnabled()) {
        console.info("[Kolding HubSpot] Form ready.", { purpose, formId, instanceId: instanceId.current });
      }
    };

    const onSubmissionFailed = (event: Event) => {
      const submissionEvent = event as HubSpotSubmissionEvent;
      if (!matchesFormInstance(submissionEvent) || redirectStarted.current) return;
      setErrorMessage("Formularen kunne ikke sendes. Kontrollér oplysningerne, og prøv igen.");
      if (diagnosticsEnabled()) {
        console.info("[Kolding HubSpot] Submission failed.", { purpose, formId, instanceId: submissionEvent.detail?.instanceId });
      }
    };

    const onSubmissionSuccess = (event: Event) => {
      const submissionEvent = event as HubSpotSubmissionEvent;
      if (redirectStarted.current || !matchesFormInstance(submissionEvent)) return;

      const formConfiguration = getFormConfiguration(purpose);
      if (!formConfiguration?.successPath || formConfiguration.formId !== formId) return;
      redirectStarted.current = true;

      const marker = createSubmissionMarker(purpose, formId, createEventId());
      try {
        window.sessionStorage.setItem(conversionMarkerKey(purpose), JSON.stringify(marker));
      } catch {
        if (diagnosticsEnabled()) {
          console.info("[Kolding HubSpot] Submission succeeded, but the conversion marker could not be stored.", { purpose });
        }
      }

      if (diagnosticsEnabled()) {
        const configuredRedirect = window.HubSpotFormsV4?.getFormFromEvent(submissionEvent)?.getRedirectUrl?.();
        console.info("[Kolding HubSpot] Confirmed submission; redirecting.", {
          purpose,
          formId,
          instanceId: submissionEvent.detail?.instanceId,
          configuredRedirect: summarizeRedirect(configuredRedirect),
          applicationRedirect: formConfiguration.successPath,
        });
      }
      window.location.assign(formConfiguration.successPath);
    };

    window.addEventListener("hs-form-event:on-ready", onFormReady);
    window.addEventListener("hs-form-event:on-submission:failed", onSubmissionFailed);
    window.addEventListener("hs-form-event:on-submission:success", onSubmissionSuccess);

    void loadHubSpotFormsScript(portalId).catch((error: unknown) => {
      setErrorMessage("Formularen kunne ikke indlæses. Genindlæs siden, eller kontakt os direkte.");
      if (diagnosticsEnabled()) console.info("[Kolding HubSpot] Form embed failed to load.", error);
    });

    return () => {
      window.removeEventListener("hs-form-event:on-ready", onFormReady);
      window.removeEventListener("hs-form-event:on-submission:failed", onSubmissionFailed);
      window.removeEventListener("hs-form-event:on-submission:success", onSubmissionSuccess);
    };
  }, [formId, portalId, purpose]);

  return (
    <>
      <div
        className={className}
        aria-label="HubSpot-formular"
        data-region="eu1"
        data-form-id={formId}
        data-portal-id={portalId}
        data-purpose={purpose}
      />
      {errorMessage ? <p className="hubspot-form-error" role="alert">{errorMessage}</p> : null}
    </>
  );
}
