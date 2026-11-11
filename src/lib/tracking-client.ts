import { conversionChannels, type ConversionRequest } from "./conversions";
import type { TrackingConsent } from "./tracking";

export type TrackingConfiguration = {
  ga4MeasurementId: string;
  googleAdsId: string;
  googleAdsSalesLeadDestination: string;
  hubSpotPortalId: string;
  metaPixelId: string;
};

type HubSpotConsent = {
  allowed?: boolean;
  categories?: {
    analytics?: boolean;
    advertisement?: boolean;
  };
};

type MetaQueue = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  loaded?: boolean;
  push?: MetaQueue;
  queue: unknown[][];
  version?: string;
};

type TrackingState = {
  initialized: boolean;
  config: TrackingConfiguration;
  consent: TrackingConsent;
  consentKnown: boolean;
  googleConfigured: boolean;
  ga4Configured: boolean;
  adsConfigured: boolean;
  metaInitialized: boolean;
  currentPath: string;
  lastGooglePath: string | null;
  lastMetaPath: string | null;
  lastHubSpotPath: string | null;
  pendingConversions: ConversionRequest[];
  metaConversionIds: Set<string>;
  googleConversionIds: Set<string>;
};

declare global {
  interface Window {
    _hsp?: unknown[][];
    _hsq?: unknown[][];
    dataLayer?: unknown[];
    fbq?: MetaQueue;
    _fbq?: MetaQueue;
    gtag?: (...args: unknown[]) => void;
    __koldingGoogleConsentDefaultSet?: boolean;
    __koldingTrackingState?: TrackingState;
    __koldingConversionQueue?: ConversionRequest[];
    KoldingTracking?: {
      queueConversion: (request: ConversionRequest) => void;
      showCookieBanner: () => void;
    };
  }
}

const localHostnames = new Set(["localhost", "127.0.0.1", "::1"]);

function diagnostic(message: string, details?: Record<string, unknown>) {
  const enabled = localHostnames.has(window.location.hostname)
    || new URLSearchParams(window.location.search).has("kr-debug");
  if (!enabled) return;
  console.info(`[Kolding Tracking] ${message}`, details ?? "");
}

function getState(config: TrackingConfiguration): TrackingState {
  if (!window.__koldingTrackingState) {
    window.__koldingTrackingState = {
      initialized: false,
      config,
      consent: { analytics: false, advertising: false },
      consentKnown: false,
      googleConfigured: false,
      ga4Configured: false,
      adsConfigured: false,
      metaInitialized: false,
      currentPath: window.location.pathname,
      lastGooglePath: null,
      lastMetaPath: null,
      lastHubSpotPath: null,
      pendingConversions: [],
      metaConversionIds: new Set(),
      googleConversionIds: new Set(),
    };
  }

  return window.__koldingTrackingState;
}

function ensureGtag() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || ((...args: unknown[]) => window.dataLayer?.push(args));
  return window.gtag;
}

function ensureGoogleConsentDefaults() {
  const gtag = ensureGtag();
  if (window.__koldingGoogleConsentDefaultSet) return gtag;

  window.__koldingGoogleConsentDefaultSet = true;
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  });
  return gtag;
}

function ensureGoogleScript(state: TrackingState) {
  const gtag = ensureGtag();

  if (!state.googleConfigured) {
    state.googleConfigured = true;
    gtag("js", new Date());

    const loaderId = state.consent.analytics
      ? state.config.ga4MeasurementId
      : state.config.googleAdsId;
    const script = document.createElement("script");
    script.id = "kolding-google-tag";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${loaderId}`;
    document.head.appendChild(script);
    diagnostic("Google tag requested after consent.", { loaderId });
  }

  if (state.consent.analytics && !state.ga4Configured) {
    state.ga4Configured = true;
    gtag("config", state.config.ga4MeasurementId, { send_page_view: false });
  }

  if (state.consent.advertising && !state.adsConfigured) {
    state.adsConfigured = true;
    gtag("config", state.config.googleAdsId, { send_page_view: false });
  }
}

function ensureMeta(state: TrackingState) {
  if (!window.fbq) {
    const fbq = ((...args: unknown[]) => {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue.push(args);
    }) as MetaQueue;

    fbq.queue = [];
    fbq.loaded = true;
    fbq.push = fbq;
    fbq.version = "2.0";
    window.fbq = fbq;
    window._fbq = fbq;

    const script = document.createElement("script");
    script.id = "kolding-meta-pixel";
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
    diagnostic("Meta Pixel library requested after advertisement consent.");
  }

  if (!state.metaInitialized) {
    window.fbq("init", state.config.metaPixelId);
    state.metaInitialized = true;
    diagnostic("Meta Pixel initialized.", { pixelId: state.config.metaPixelId });
  }

  window.fbq("consent", "grant");
}

function metaEventsForPath(pathname: string) {
  const events = ["PageView"];
  const isContentPage = pathname === "/"
    || pathname === "/job"
    || pathname === "/privatlivspolitik"
    || /^\/(?:egtved|haderslev|vejle)$/.test(pathname)
    || pathname.startsWith("/services/");

  if (isContentPage) events.push("ViewContent");

  const includesLegacyContactEvent = pathname === "/privatlivspolitik"
    || /^\/(?:egtved|haderslev|vejle)$/.test(pathname)
    || /^\/services\/(?:kontor|restauranter|solarium|sommerhus)$/.test(pathname);

  if (includesLegacyContactEvent) events.push("Contact");
  return events;
}

function trackCurrentRoute(state: TrackingState) {
  const pathname = state.currentPath;

  if (state.consent.analytics && state.lastGooglePath !== pathname) {
    ensureGoogleScript(state);
    window.gtag?.("event", "page_view", {
      page_location: window.location.href,
      page_path: pathname,
      page_title: document.title,
    });
    state.lastGooglePath = pathname;
    diagnostic("GA4 page_view queued.", { pathname });
  }

  if (state.consent.advertising && state.lastMetaPath !== pathname) {
    ensureMeta(state);
    for (const eventName of metaEventsForPath(pathname)) {
      window.fbq?.("track", eventName);
    }
    state.lastMetaPath = pathname;
    diagnostic("Meta route events queued.", { pathname, events: metaEventsForPath(pathname) });
  }
}

function emitConversion(state: TrackingState, request: ConversionRequest) {
  if (!state.consent.advertising) return;

  ensureGoogleScript(state);
  ensureMeta(state);
  const channels = conversionChannels(request.purpose);

  if (!state.metaConversionIds.has(request.eventId)) {
    if ("metaStandardEvent" in channels) {
      window.fbq?.("track", channels.metaStandardEvent, {}, { eventID: request.eventId });
      state.metaConversionIds.add(request.eventId);
    } else if ("metaCustomEvent" in channels) {
      window.fbq?.("trackCustom", channels.metaCustomEvent, {}, { eventID: request.eventId });
      state.metaConversionIds.add(request.eventId);
    }
  }

  if (channels.googleAds && !state.googleConversionIds.has(request.eventId)) {
    window.gtag?.("event", "conversion", {
      send_to: state.config.googleAdsSalesLeadDestination,
    });
    state.googleConversionIds.add(request.eventId);
  }

  diagnostic("Confirmed conversion emitted.", {
    purpose: request.purpose,
    eventId: request.eventId,
  });
}

function flushConversions(state: TrackingState) {
  if (!state.consent.advertising) return;
  const pending = state.pendingConversions.splice(0);
  for (const request of pending) emitConversion(state, request);
}

export function queueConversion(request: ConversionRequest) {
  const state = window.__koldingTrackingState;
  if (!state) {
    window.__koldingConversionQueue = window.__koldingConversionQueue || [];
    window.__koldingConversionQueue.push(request);
    return;
  }

  const duplicate = state.pendingConversions.some((item) => item.eventId === request.eventId)
    || state.metaConversionIds.has(request.eventId)
    || state.googleConversionIds.has(request.eventId);

  if (duplicate) {
    diagnostic("Duplicate conversion ignored.", { purpose: request.purpose, eventId: request.eventId });
    return;
  }

  if (state.consent.advertising) emitConversion(state, request);
  else {
    state.pendingConversions.push(request);
    diagnostic("Confirmed conversion waiting for advertisement consent.", { purpose: request.purpose });
  }
}

function updateConsent(state: TrackingState, consent: HubSpotConsent) {
  const categories = consent.categories || {};
  state.consent = {
    analytics: Boolean(consent.allowed || categories.analytics),
    advertising: Boolean(consent.allowed || categories.advertisement),
  };
  state.consentKnown = true;

  ensureGtag()("consent", "update", {
    ad_storage: state.consent.advertising ? "granted" : "denied",
    ad_user_data: state.consent.advertising ? "granted" : "denied",
    ad_personalization: state.consent.advertising ? "granted" : "denied",
    analytics_storage: state.consent.analytics ? "granted" : "denied",
  });

  if (state.consent.analytics || state.consent.advertising) ensureGoogleScript(state);
  if (state.consent.advertising) ensureMeta(state);
  else if (state.metaInitialized) window.fbq?.("consent", "revoke");

  diagnostic("HubSpot consent updated.", state.consent);
  trackCurrentRoute(state);
  flushConversions(state);
}

function loadHubSpotTracking(portalId: string) {
  if (document.getElementById("hs-script-loader")) return;
  const script = document.createElement("script");
  script.id = "hs-script-loader";
  script.async = true;
  script.defer = true;
  script.src = `https://js-eu1.hs-scripts.com/${portalId}.js`;
  script.addEventListener("load", () => diagnostic("HubSpot tracking and consent loader loaded."), { once: true });
  script.addEventListener("error", () => diagnostic("HubSpot tracking and consent loader failed."), { once: true });
  document.body.appendChild(script);
}

export function initializeTracking(config: TrackingConfiguration) {
  ensureGoogleConsentDefaults();
  const state = getState(config);
  if (state.initialized) return;
  state.initialized = true;

  window._hsp = window._hsp || [];
  window._hsp.push(["addPrivacyConsentListener", (consent: HubSpotConsent) => updateConsent(state, consent)]);
  window._hsq = window._hsq || [];
  loadHubSpotTracking(config.hubSpotPortalId);

  window.KoldingTracking = {
    queueConversion,
    showCookieBanner: () => {
      window._hsp = window._hsp || [];
      window._hsp.push(["showBanner"]);
    },
  };

  for (const request of window.__koldingConversionQueue || []) queueConversion(request);
  window.__koldingConversionQueue = [];
  diagnostic("Consent-aware tracking initialized.");
}

export function notifyRouteChange(pathname: string) {
  const state = window.__koldingTrackingState;
  if (!state) return;

  state.currentPath = pathname;
  if (state.lastHubSpotPath === null) state.lastHubSpotPath = pathname;
  else if (state.lastHubSpotPath !== pathname) {
    window._hsq = window._hsq || [];
    window._hsq.push(["setPath", pathname]);
    window._hsq.push(["trackPageView"]);
    state.lastHubSpotPath = pathname;
    diagnostic("HubSpot SPA pageview queued.", { pathname });
  }

  window.setTimeout(() => trackCurrentRoute(state), 0);
}

export function showCookieBanner() {
  window._hsp = window._hsp || [];
  window._hsp.push(["showBanner"]);
  diagnostic("HubSpot Cookie Settings requested.");
}
