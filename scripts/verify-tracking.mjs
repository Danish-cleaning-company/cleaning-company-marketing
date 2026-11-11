import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const outputDirectory = mkdtempSync(join(tmpdir(), "kr-tracking-test-"));

try {
  execFileSync(
    process.execPath,
    [
      "./node_modules/typescript/bin/tsc",
      "src/lib/conversions.ts",
      "src/lib/google-consent.ts",
      "src/lib/tracking-client.ts",
      "--outDir",
      outputDirectory,
      "--module",
      "commonjs",
      "--target",
      "ES2020",
      "--lib",
      "DOM,ES2020",
      "--skipLibCheck",
      "--esModuleInterop",
      "--noEmit",
      "false",
    ],
    { cwd: projectRoot, stdio: "inherit" },
  );

  const require = createRequire(import.meta.url);
  const conversions = require(join(outputDirectory, "conversions.js"));
  const googleConsent = require(join(outputDirectory, "google-consent.js"));
  const tracking = require(join(outputDirectory, "tracking-client.js"));

  const command = (entry) => Array.from(entry);
  const commands = (runtimeWindow, name, action) => runtimeWindow.dataLayer
    .map(command)
    .filter((entry) => entry[0] === name && (action === undefined || entry[1] === action));

  function createRuntime() {
    const scripts = [];
    const createContainer = () => ({ appendChild: (element) => scripts.push(element) });
    globalThis.document = {
      title: "Test page",
      head: createContainer(),
      body: createContainer(),
      createElement: () => ({ id: "", async: false, defer: false, src: "", dataset: {}, addEventListener: () => {} }),
      getElementById: (id) => scripts.find((script) => script.id === id) ?? null,
    };
    globalThis.window = {
      location: { hostname: "example.invalid", pathname: "/", href: "https://example.invalid/" },
      setTimeout: (callback) => { callback(); return 1; },
    };

    new Function("window", googleConsent.googleConsentDefaultsScript)(window);
    tracking.initializeTracking({
      ga4MeasurementId: "G-TEST",
      googleAdsId: "AW-TEST",
      googleAdsSalesLeadDestination: "AW-TEST/LEAD",
      hubSpotPortalId: "123",
      metaPixelId: "999",
    });
    tracking.notifyRouteChange("/");

    const consentListener = window._hsp.find((entry) => entry[0] === "addPrivacyConsentListener")[1];
    return { consentListener, scripts, window };
  }

  function assertDefaultDenied(runtime) {
    const defaults = commands(runtime.window, "consent", "default");
    assert.equal(defaults.length, 1);
    assert.deepEqual(defaults[0][2], {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    });
  }

  const validMarker = conversions.createSubmissionMarker("recruitment_application", "recruitment-form", "event-1", 1_000);
  assert.equal(conversions.isValidSubmissionMarker(validMarker, "recruitment_application", "recruitment-form", 2_000), true);
  assert.equal(conversions.isValidSubmissionMarker(validMarker, "sales_lead", "recruitment-form", 2_000), false);
  assert.equal(conversions.isValidSubmissionMarker(validMarker, "recruitment_application", "recruitment-form", 1_000 + conversions.conversionMarkerLifetimeMs + 1), false);
  assert.deepEqual(conversions.conversionChannels("sales_lead"), { metaStandardEvent: "Lead", googleAds: true });
  assert.deepEqual(conversions.conversionChannels("recruitment_application"), { metaCustomEvent: "RecruitmentApplication", googleAds: false });
  assert.deepEqual(conversions.conversionChannels("existing_customer_enquiry"), { googleAds: false });
  assert.deepEqual(conversions.conversionChannels("subcontractor_application"), { googleAds: false });

  const fresh = createRuntime();
  assertDefaultDenied(fresh);
  assert.deepEqual(fresh.scripts.map((script) => script.id), ["hs-script-loader"]);
  tracking.showCookieBanner();
  assert.deepEqual(fresh.window._hsp.at(-1), ["showBanner"]);

  const rejected = createRuntime();
  rejected.consentListener({ categories: { analytics: false, advertisement: false } });
  assertDefaultDenied(rejected);
  assert.deepEqual(rejected.scripts.map((script) => script.id), ["hs-script-loader"]);
  assert.deepEqual(commands(rejected.window, "consent", "update").at(-1)[2], {
    ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied",
  });

  const analyticsOnly = createRuntime();
  analyticsOnly.consentListener({ categories: { analytics: true, advertisement: false } });
  assertDefaultDenied(analyticsOnly);
  assert.equal(analyticsOnly.scripts.filter((script) => script.id === "kolding-google-tag").length, 1);
  assert.equal(analyticsOnly.scripts.find((script) => script.id === "kolding-google-tag").src.endsWith("id=G-TEST"), true);
  assert.equal(analyticsOnly.scripts.some((script) => script.id === "kolding-meta-pixel"), false);
  assert.equal(commands(analyticsOnly.window, "config", "G-TEST").length, 1);
  assert.equal(commands(analyticsOnly.window, "config", "AW-TEST").length, 0);
  assert.equal(commands(analyticsOnly.window, "event", "page_view").length, 1);
  analyticsOnly.consentListener({ categories: { analytics: true, advertisement: false } });
  tracking.notifyRouteChange("/");
  assert.equal(commands(analyticsOnly.window, "config", "G-TEST").length, 1);
  assert.equal(commands(analyticsOnly.window, "event", "page_view").length, 1);

  const advertisingOnly = createRuntime();
  advertisingOnly.consentListener({ categories: { analytics: false, advertisement: true } });
  assert.equal(commands(advertisingOnly.window, "config", "G-TEST").length, 0);
  assert.equal(commands(advertisingOnly.window, "config", "AW-TEST").length, 1);
  assert.equal(commands(advertisingOnly.window, "event", "page_view").length, 0);
  assert.equal(advertisingOnly.scripts.find((script) => script.id === "kolding-google-tag").src.endsWith("id=AW-TEST"), true);
  assert.equal(advertisingOnly.scripts.filter((script) => script.id === "kolding-meta-pixel").length, 1);

  const accepted = createRuntime();
  tracking.queueConversion({ purpose: "sales_lead", formId: "sales-form", eventId: "sales-event" });
  tracking.queueConversion({ purpose: "recruitment_application", formId: "job-form", eventId: "job-event" });
  accepted.consentListener({ allowed: true });
  assert.equal(commands(accepted.window, "config", "G-TEST").length, 1);
  assert.equal(commands(accepted.window, "config", "AW-TEST").length, 1);
  assert.equal(commands(accepted.window, "event", "page_view").length, 1);
  assert.equal(commands(accepted.window, "event", "conversion").length, 1);
  assert.equal(accepted.window.fbq.queue.filter((entry) => entry[0] === "track" && entry[1] === "Lead").length, 1);
  assert.equal(accepted.window.fbq.queue.filter((entry) => entry[0] === "trackCustom" && entry[1] === "RecruitmentApplication").length, 1);
  tracking.queueConversion({ purpose: "sales_lead", formId: "sales-form", eventId: "sales-event" });
  tracking.queueConversion({ purpose: "recruitment_application", formId: "job-form", eventId: "job-event" });
  assert.equal(commands(accepted.window, "event", "conversion").length, 1);

  accepted.window.location.pathname = "/job";
  accepted.window.location.href = "https://example.invalid/job";
  tracking.notifyRouteChange("/job");
  tracking.notifyRouteChange("/job");
  assert.equal(commands(accepted.window, "event", "page_view").length, 2);
  assert.equal(accepted.window.fbq.queue.filter((entry) => entry[0] === "track" && entry[1] === "PageView").length, 2);
  assert.equal(accepted.window._hsq.filter((entry) => entry[0] === "trackPageView").length, 1);

  accepted.consentListener({ categories: { analytics: false, advertisement: false } });
  assert.deepEqual(commands(accepted.window, "consent", "update").at(-1)[2], {
    ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied",
  });
  assert.equal(accepted.window.fbq.queue.some((entry) => entry[0] === "consent" && entry[1] === "revoke"), true);
  const googlePageviewsBeforeWithdrawalNavigation = commands(accepted.window, "event", "page_view").length;
  const metaPageviewsBeforeWithdrawalNavigation = accepted.window.fbq.queue.filter((entry) => entry[0] === "track" && entry[1] === "PageView").length;
  accepted.window.location.pathname = "/vejle";
  accepted.window.location.href = "https://example.invalid/vejle";
  tracking.notifyRouteChange("/vejle");
  assert.equal(commands(accepted.window, "event", "page_view").length, googlePageviewsBeforeWithdrawalNavigation);
  assert.equal(accepted.window.fbq.queue.filter((entry) => entry[0] === "track" && entry[1] === "PageView").length, metaPageviewsBeforeWithdrawalNavigation);

  console.log("Tracking behavior verification passed: consent defaults, category grants, withdrawal, pageviews, and deduplication.");
} finally {
  rmSync(outputDirectory, { recursive: true, force: true });
}
