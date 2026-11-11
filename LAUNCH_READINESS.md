# Launch Readiness

**Assessment date:** 2026-11-11  
**Status:** NOT READY FOR PRODUCTION  
**Scope:** Phase 5 staging defect investigation and fixes  
**Production deployment performed:** No

## Executive Summary

The Next.js static export builds successfully and passes automated SEO, link, structured-data, consent-state, and conversion-separation checks. A staging-only artifact is available at `staging-out/` after running `npm run build:staging`; it contains page-level noindex tags, an `X-Robots-Tag` header rule, a blocking robots file, and draft Netlify redirects.

Phase 5.1 optimized every image previously larger than 500 KB. After Phase 5.2 physically normalized the two restaurant photo orientations, the eight source families occupy 2.62 MB including responsive variants, and no image in `public/` exceeds 500 KB. Net static-asset savings remain approximately 21.42 MB after including two responsive variants added for the existing solarium image.

The restaurant before/after section now uses a reusable, two-card responsive gallery. The optimized 3:4 WebP sources remain unchanged; fixed responsive media frames use `object-fit: cover` and a floor-focused position without distorting the images.

Production is hosted by Netlify and is connected to the GitHub repository `A-Berezvay/Kolding-Rengoering`. No Netlify, GitHub, DNS, HubSpot, Google, or Meta configuration was changed.

Staging is available at `https://enchanting-frangipane-c4c157.netlify.app/`. Phase 5.2 corrected the restaurant image orientation and hardened HubSpot form failure handling locally. The HubSpot banner is now reported working on staging. Production launch remains blocked by pending redeployment of local fixes, authorized end-to-end form delivery, CRM/workflow behavior, analytics debugger verification, and Core Web Vitals.

## Staging Strategy

### Recommended topology

Use a dedicated Netlify site, separate from the production Netlify site and with no production domain alias.

- Build command: `npm run build:staging`
- Publish directory: `staging-out`
- Staging URL: `https://enchanting-frangipane-c4c157.netlify.app/`
- Production Git repository/site settings: unchanged
- Automatic production deploys: disabled for the staging site
- Access: restrict with Netlify access control/password protection where available

The dedicated-site approach is safer than a production-site branch deploy because it prevents staging build settings, domain aliases, redirects, and deploy promotion from affecting the current website.

The complete manual procedure is in `STAGING_DEPLOYMENT.md`. It uses Netlify's separate manual-deploy flow and publishes only the generated `staging-out/` directory.

### Indexing protection

`scripts/prepare-staging.mjs` creates a separate artifact and does not mutate `out/`.

- Every staging HTML document receives `noindex, nofollow, noarchive, nosnippet`.
- `staging-out/_headers` sends the equivalent `X-Robots-Tag` for every response.
- `staging-out/robots.txt` disallows all crawling.
- Canonicals intentionally point to the production apex hostname `https://kolding-rengoering.dk`, not the staging host.
- `staging-out/_redirects` contains the draft migration redirects for staging verification.

### Integration prerequisites

The HubSpot banner is reported working on the staging hostname. Do not change form IDs, analytics IDs, conversion definitions, or workflows.

The staging build uses the production HubSpot, GA4, Google Ads, and Meta identifiers. Tests must therefore use recognizable test traffic and must not submit forms until creation and cleanup of live CRM test records is explicitly approved.

## Phase 5.2 Findings

### P0: HubSpot forms

- The portal ID, sales form ID, and recruitment form ID match the original working website.
- The form and tracking loaders return `200`, and staging has no Content Security Policy blocking HubSpot.
- Form embeds are independent of advertising consent and are not blocked by the local consent state.
- HubSpot's public embed code emits success only after its internal submission-success message and emits a separate failure event.
- The previous component ignored submission-failure events and exposed no loader or submission feedback. It also matched callbacks by form ID only.
- The component now records the rendered instance ID, handles ready/success/failure events for that instance, displays a non-PII error message, and writes conversion markers only inside the confirmed-success branch.
- `?kr-debug=1` enables purpose/form/instance diagnostics without logging submitted field values.
- Actual HubSpot contact delivery remains unverified because no production test record was authorized.
- The observed absolute redirect to `https://kolding-rengoering.dk/job-thank-you.html?submissionGuid=...` cannot originate from the legacy callback or Next.js callback: both use root-relative paths and neither appends `submissionGuid`.
- HubSpot's embed protocol receives the portal-configured redirect URL as submission-success metadata before emitting the global success event. Diagnostic mode now reports only that configured destination's origin/path, never the GUID or applicant fields.
- Recommended account-side change: set the recruitment form's post-submit action to an inline thank-you state. The original callback will continue redirecting production to `/job-thank-you.html`, while Next.js redirects the current host to `/job-thank-you`. This preserves production behavior and permits staging, but requires approval because it changes the live form.

### P0: HubSpot consent banner

- Portal ID and script order are correct: the privacy listener is queued before the HubSpot loader.
- The HubSpot loader and banner script both return `200`.
- The HubSpot banner is now reported working on the Netlify staging hostname. No second local consent system was added.
- The Cookie Settings control now queues `showBanner` directly even if the tracking facade has not finished initializing.
- The previous Google Consent Mode default was queued only after React hydration. The initial HTML therefore exposed no default consent command to Tag Assistant before client tracking initialized.
- Consent Mode v2 now initializes in an inline head bootstrap with `analytics_storage`, `ad_storage`, `ad_user_data`, and `ad_personalization` denied. The client fallback is idempotent and cannot queue a second default.
- HubSpot analytics and advertisement category changes issue official `gtag("consent", "update", ...)` commands. Withdrawal returns all four signals to denied and revokes Meta consent.

### P0: Google Consent Mode and GA4

- Tag Assistant reported the Ads destination sending while GA4 showed deferred/no hits and no default consent state.
- Root cause 1: Consent Mode defaults existed only in the hydrated client effect, so they were absent during initial document/tag inspection and could race restored HubSpot consent.
- Root cause 2: the shared Google library URL always used the GA4 measurement ID. Advertising-only consent therefore made Tag Assistant detect GA4 even though the code correctly withheld GA4 configuration and pageviews.
- The denied Consent Mode v2 default now runs inline in the document head before the hydrated tracking provider can configure or emit any Google destination.
- The single Google library loads only after valid HubSpot consent. It uses the GA4 ID when analytics is granted and the Ads ID for advertising-only consent; subsequent category grants reuse the same script.
- GA4 and Ads each receive one `config` command when their category first becomes granted. GA4 automatic pageviews remain disabled and one manual `page_view` is emitted for the initial route and each distinct client-side route.
- Existing Google Ads sales conversion, Meta `Lead`, and Meta `RecruitmentApplication` mappings are unchanged.
- The corrected artifact requires staging redeployment and Google Tag Assistant/GA4 DebugView verification before the browser-level issue can be considered closed.

### P1: Restaurant image orientation

- The original JPEGs store 4032×3024 raw pixels but display logically as 3024×4032 portrait images.
- Phase 5.1 encoded the raw pixels into WebP without normalizing orientation, producing sideways images.
- Both sources were physically rotated clockwise before encoding. The generated dimensions are 480×640, 768×1024, and 1280×1707.
- Intrinsic component dimensions now use the correct 3:4 ratio. No CSS rotation was added.
- Visual inspection confirms both corrected images are upright.

### Redirect-loop investigation

- There is no `netlify.toml`; staging redirects are generated only by `scripts/prepare-staging.mjs`.
- `next.config.ts` does not enable `trailingSlash`; the export contains files such as `services/kontor.html`, while all generated canonical navigation links use `/services/kontor`.
- Netlify normalizes `/path/` and `/path` when matching rules. Forced rules such as `/job/ /job 301!` therefore matched `/job` and returned `301 Location: /job`, creating a self-loop.
- The live chain is a direct self-redirect, not `/path` alternating with `/path/`. For example, `/services/kontor` returns `301 Location: /services/kontor`.
- App Router-style requests with `RSC: 1`, `Next-Router-Prefetch: 1`, and `?_rsc=...` receive the same self-redirect from the deployed artifact. Next.js prefetch multiplies the failing requests but does not create the redirect.
- Actual HTTP tests reproduced self-loops on all five service routes, all three city routes, `/job`, and `/privatlivspolitik`.
- Routes without a custom trailing-slash rule returned `200`, including `/`, `/kontakt`, `/faa-tilbud`, `/thank-you`, and `/job-thank-you`.
- The ten explicit trailing-slash rules were removed. Netlify's built-in Pretty URLs behavior handles slash and `.html` normalization; legacy path migrations remain explicit.
- The staging generator now refuses to write any redirect whose source and target normalize to the same Netlify path.
- The corrected rules require a new staging deployment before final HTTP verification against Netlify.

## Passed Tests

### Build and static export

- **Passed:** Next.js production build.
- **Passed:** 21 static pages generated.
- **Passed:** Staging artifact generated independently from production output.
- **Passed:** All 17 generated HTML documents include staging noindex protection.
- **Passed:** Staging robots file blocks all crawlers.
- **Passed:** Staging `X-Robots-Tag` rule is present.
- **Passed:** 22 draft redirect rules generated for staging verification with no normalized self-redirects.
- **Passed:** Local HTTP chain verification covers all canonical service/location routes plus trailing-slash, `.html`, and legacy city variants; every chain ends at `200` after zero or one redirect.
- **Passed:** Local App Router-style prefetch requests for every service route return `200` without redirects.

### Routes and assets

- **Passed:** Homepage, five service routes, three root city routes, job, privacy, both thank-you routes, placeholders, sitemap, and robots return `200` from the local Next.js server.
- **Passed:** Zero broken internal HTML references in `out/` and `staging-out/`.
- **Passed:** Zero missing CSS asset references.
- **Passed:** Public HubSpot form loader returns `200`.
- **Passed:** Public HubSpot tracking/consent loader returns `200`.
- **Passed:** Exactly nine sales form frames and one recruitment form frame are present in the static export.
- **Passed:** No image asset exceeds 500 KB.
- **Passed:** Oversized photographs have 480 px, 768 px, and 1280 px WebP candidates where used responsively.
- **Passed:** Responsive image markup retains explicit dimensions to prevent image-driven layout shifts.

### Image optimization

Sizes include every generated responsive variant for each family.

| Image family | Before | After | Saving |
| --- | ---: | ---: | ---: |
| `clean-office` | 7.29 MB | 0.25 MB | 96.6% |
| `Kitchen_after` | 4.28 MB | 0.68 MB | 84.2% |
| `Kitchen_before` | 4.00 MB | 0.58 MB | 85.4% |
| `jason-leung-poI7DelFiVA-unsplash` | 3.98 MB | 0.27 MB | 93.2% |
| `clean-restaurant` | 1.45 MB | 0.30 MB | 79.0% |
| `Hereford_floor` | 1.14 MB | 0.31 MB | 73.3% |
| `institutioner` | 1.10 MB | 0.11 MB | 90.3% |
| `Hero-image` | 0.85 MB | 0.12 MB | 86.2% |
| **Total** | **24.10 MB** | **2.62 MB** | **21.48 MB / 89.1%** |

The homepage hero `Post_9.webp` was already 0.23 MB and was not recompressed. Logos were not altered. Visual inspection of the optimized 1280 px masters found no material quality regression. Browser-based LCP and visual-regression measurements remain required on staging.

### Before/after gallery

- **Passed:** The restaurant gallery is a reusable React component with two equal-width cards and no client-side JavaScript.
- **Passed:** The gallery remains two columns at 375 px, 768 px, and 1440 px.
- **Passed:** Calculated card sizes are 170.5×240 px, 360.3×400 px, and 390×417.6 px respectively.
- **Passed:** `minmax(0, 1fr)`, bounded gaps, and a maximum gallery width of 800 px prevent horizontal overflow.
- **Passed:** Images fill the media frame with `object-fit: cover` and `object-position: center 58%`; intrinsic dimensions remain 3:4 and are never stretched.
- **Passed:** Both labels remain overlaid inside their clipped cards.
- **Passed:** Existing 480 px, 768 px, and 1280 px WebP candidates and lazy loading are preserved.
- **Pending:** Real-browser visual confirmation at the three target widths remains required after staging redeployment.

### SEO

- **Passed:** All generated canonical URLs use `https://kolding-rengoering.dk`.
- **Passed:** No generated canonical path has a trailing slash.
- **Passed:** No duplicate indexed titles or descriptions were detected.
- **Passed:** All generated JSON-LD parses as valid JSON.
- **Passed:** Thank-you pages are `noindex, nofollow` and excluded from the sitemap.
- **Passed:** Sitemap contains the homepage, five services, three root city routes, job, and privacy policy.
- **Passed:** Production robots output references `https://kolding-rengoering.dk/sitemap.xml`.
- **Passed:** Sitemap, Open Graph URLs, metadata base, location/service records, JSON-LD, and the migrated privacy-policy website link use the same apex hostname.

### Consent and conversions

- **Passed:** Dependency-free tracking simulation verifies fresh/no-consent, rejection, analytics-only, advertising-only, accept-all, withdrawal, initial pageview, client navigation, and repeated-listener states.
- **Passed:** Exactly one denied Consent Mode v2 default is queued before client tracking initialization.
- **Passed:** GA4 and Ads configuration commands and scripts are each deduplicated.
- **Passed:** Advertising-only consent loads the shared Google library with the Ads ID and does not configure GA4 or emit a GA4 pageview.
- **Passed:** Analytics consent configures GA4 and emits exactly one initial pageview plus one per distinct client-side route.
- **Passed:** Google and Meta libraries are not requested before the corresponding simulated consent.
- **Passed:** Meta PageView uses standard `track`, not `trackCustom`.
- **Passed:** Sales emits Meta `Lead` and the existing Google Ads destination only after a confirmed marker.
- **Passed:** Recruitment emits only `RecruitmentApplication` and never the sales conversion.
- **Passed:** Duplicate event IDs are suppressed.
- **Passed:** Expired, incorrect, missing, and already-consumed markers do not emit conversions.
- **Passed:** Diagnostic output contains purpose/event identifiers only, not submitted personal fields.

### Repository integrity

- **Passed:** The original `Website/` repository remains clean and unmodified.
- **Passed:** No external deployment or production configuration change occurred.

## Failed or Blocked Tests

### Blocker: Corrected staging artifact not deployed

The live staging site still serves the old self-looping redirect rules. The corrected 22-rule artifact has not been deployed, so external HTTP and client-side navigation confirmation remain pending. No deployment was performed automatically.

### Blocker: Permanent redirects are not installed in production

The currently indexed city routes use `/byer/{city}/`, while the migration uses `/{city}`. Current production returns `404` for `/egtved`, `/haderslev`, `/vejle`, and `/privatlivspolitik`. Existing `.html` and clean service/job URLs both return `200`, creating duplicate-access paths rather than permanent redirects.

### Blocker: HubSpot end-to-end submissions not approved

No sales or recruitment form was submitted. The following are unverified:

- Sales contact creation and classification
- Recruitment contact creation and classification
- Recruitment CV upload and file attachment
- Sales deal creation
- Exclusion of recruitment contacts from sales workflows
- Duplicate contact/deal behavior
- Actual HubSpot post-submission redirect timing versus the local success listener

The local code must not be described as delivering contacts successfully until an approved sales and recruitment submission is observed in HubSpot and correlated with successful browser network responses.

### Blocker: Consent and analytics browser verification

The HubSpot banner is reported working, but the corrected local Consent Mode/GA4 lifecycle has not been deployed. After redeployment, HubSpot category synchronization, GA4 DebugView, Google Tag Assistant, Google Ads diagnostics, Meta Pixel Helper/Test Events, and HubSpot page analytics require manual browser verification.

## Manual Tests Remaining

### Blocker

- Compare original and migrated homepage at desktop widths 1440, 1024, and mobile widths 390 and 360.
- Compare representative service pages, all three location pages, job, privacy, and thank-you pages at desktop and mobile widths.
- Verify header hover, keyboard, outside-click, and mobile menu behavior in Safari, Chrome, and Firefox.
- Verify partner carousel motion and reduced-motion behavior.
- Verify both HubSpot forms render after direct load and after client-side navigation.
- Submit one approved Sales Prospect test record and verify exactly one contact, correct classification, intended deal/workflow behavior, `/thank-you`, Meta `Lead`, and Google Ads conversion.
- Submit one approved Job Candidate test record with a harmless test CV and verify exactly one contact, correct classification, no sales deal/workflow, `/job-thank-you`, and only `RecruitmentApplication`.
- Delete or archive approved test contacts, applications, uploaded CV files, deals, workflow enrollments, and related analytics test records after verification.
- Test Accept All, Reject All, analytics-only, advertisement-only, settings withdrawal, and returning-visitor consent states.
- Confirm no Google/Meta requests or cookies before applicable consent using browser network and storage panels.
- Confirm client-side navigation sends one pageview per route without duplicate Pixel initialization.
- Run Lighthouse or equivalent against the deployed staging URL and record LCP, INP, CLS, accessibility, and mobile results.

### Important

- Verify social share metadata using external validators after staging is publicly reachable.
- Validate structured data with Google's Rich Results Test after staging deployment.
- Crawl the deployed staging URL with redirect following enabled.
- Confirm Netlify serves extensionless paths with the expected content type and cache headers.
- Legal/content review of the English privacy policy and its February 11, 2025 update date.

## Issues by Severity

### Blocker

1. Indexed `/byer/{city}/` URLs require permanent redirects to root city routes.
2. The corrected artifact requires redeployment and browser regression testing.
3. HubSpot contact classification, CV upload, workflow/deal separation, and live submission behavior remain unverified.
4. Consent UI callbacks and real GA4/Google Ads/Meta behavior remain unverified against the corrected artifact.

### Important

1. Browser-measured LCP, CLS, visual regression, and mobile usability remain unverified until staging is available.
2. The privacy policy remains English, contains generated markup, and is dated February 11, 2025; legal review is required.
3. Existing Customer and Subcontractor categories have no approved HubSpot form IDs, classifications, or workflows.
4. `/kontakt` and `/faa-tilbud` remain noindex placeholders rather than migrated production pages.
5. Production currently serves `.html` and clean variants with `200`; explicit redirects are needed to consolidate signals.

### Optional

1. Remove unused default Next.js public assets.
2. Add automated accessibility and visual-regression testing once a browser runner is available.
3. Add automated post-deploy smoke tests for Netlify headers, redirects, canonical tags, and integration-loader uniqueness.
4. Replace the generated privacy-policy HTML with maintained semantic content after legal approval.

## SEO Migration Risks

- Search results currently expose the apex hostname and legacy `/byer/{city}/` pages.
- Changing city paths without simultaneous 301 redirects would split or lose ranking signals.
- The apex hostname now matches the original sitemap, 12 of 13 original canonical declarations, and the current production final hostname.
- Serving both `.html` and extensionless URLs with `200` risks duplicate crawling.
- Staging must never be promoted with its injected noindex metadata. Production must deploy from `out/`, not `staging-out/`.
- Redirects must preserve query strings and avoid chains.

## Canonical Hostname Investigation

### `https://kolding-rengoering.dk`

- Matches the hostname that currently resolves as production's final destination.
- Matches the hostname exposed by the indexed production results observed during Phase 5.
- Matches the original XML sitemap and 12 of 13 original page canonicals.
- Avoids combining a hostname migration with the already-required city-path and `.html` migrations.
- Is now configured consistently in Next.js canonicals, sitemap, robots, Open Graph URLs, and JSON-LD.

### `https://www.kolding-rengoering.dk`

- Requires reversing the current Netlify primary-domain direction so apex permanently redirects to `www`.
- Adds a hostname migration at the same time as route migration, increasing reliance on perfect single-hop redirects and consistent canonical signals.
- Is present in one original service canonical and the original robots sitemap reference, both inconsistent with the larger apex evidence set.

### Decision

The apex hostname is retained because it minimizes observable SEO migration risk and matches the dominant original and live signals. Search Console and backlink evidence should still be reviewed before launch, but it is no longer a blocker unless that evidence materially contradicts the current configuration. The existing `www` to apex production redirect direction is correct and was not changed.

## Required Production Redirects

All redirects must be single-hop permanent `301` responses.

```text
http://kolding-rengoering.dk/*          -> https://kolding-rengoering.dk/:splat
http://www.kolding-rengoering.dk/*      -> https://kolding-rengoering.dk/:splat
https://www.kolding-rengoering.dk/*     -> https://kolding-rengoering.dk/:splat
/index.html                             -> /
/byer/egtved                            -> /egtved
/byer/egtved/                           -> /egtved
/byer/egtved/index.html                 -> /egtved
/byer/haderslev                         -> /haderslev
/byer/haderslev/                        -> /haderslev
/byer/haderslev/index.html              -> /haderslev
/byer/vejle                             -> /vejle
/byer/vejle/                            -> /vejle
/byer/vejle/index.html                  -> /vejle
/services/institutioner.html            -> /services/institutioner
/services/restauranter.html             -> /services/restauranter
/services/kontor.html                   -> /services/kontor
/services/solarium.html                 -> /services/solarium
/services/sommerhus.html                -> /services/sommerhus
/job.html                               -> /job
/thank-you.html                         -> /thank-you
/job-thank-you.html                     -> /job-thank-you
/privacy-policy                         -> /privatlivspolitik
/privacy-policy.html                    -> /privatlivspolitik
/services/privacy-policy                -> /privatlivspolitik
/services/privacy-policy.html           -> /privatlivspolitik
```

Canonical routes with a trailing slash must resolve to the same path without the trailing slash through Netlify Pretty URLs. Do not add forced slash-to-clean rules because Netlify normalizes both sources during matching and can create self-redirects. Draft legacy path rules are generated in `staging-out/_redirects`; production Netlify domain direction must be configured separately after canonical-host approval.

## Tracking and HubSpot Risks

- Staging uses production integration IDs, so approved tests will appear in production HubSpot and analytics systems unless account-level filters/test modes are used.
- HubSpot form/workflow configuration is external to this repository and cannot be proven from the embed IDs alone.
- The HubSpot banner is reported working on staging; its category callbacks still require network-level verification against the corrected artifact.
- Browser extensions/debug views are required to verify network-level consent enforcement and event delivery.
- Session storage failure still allows a successful HubSpot redirect but intentionally suppresses conversion emission because a verifiable one-time marker cannot be persisted.
- No submitted field values are used by local conversion code, but browser network verification is still required to confirm third-party payloads.

## Recommended Launch Procedure

1. Resolve all Blockers on a dedicated Netlify staging site.
2. Optimize oversized images and rerun mobile Lighthouse until agreed budgets pass.
3. Obtain approval for two clearly named HubSpot test records and their cleanup plan.
4. Complete desktop/mobile visual comparison and integration debugger tests.
5. Freeze content and merge the reviewed `Website-Next` release commit.
6. Record the current production Netlify deploy ID and download/archive the current production artifact.
7. Prepare the production artifact from `out/`, never `staging-out/`.
8. Add the reviewed production `_redirects` rules to the deployment artifact.
9. Deploy to a non-primary Netlify deploy preview and run final smoke tests.
10. Publish the approved deploy to the existing Netlify production site.
11. Retain `kolding-rengoering.dk` as the Netlify primary domain and confirm `www` redirects to apex in one hop.
12. Verify every indexed legacy URL returns one `301` followed by one `200` canonical destination.
13. Verify robots, sitemap, canonicals, forms, consent, and conversion debugging in production.
14. Monitor Netlify errors, Search Console indexing, HubSpot submissions, GA4, Google Ads, and Meta for at least 48 hours.

## Rollback Procedure

1. Stop new changes and record the failing URL, timestamp, browser, and deploy ID.
2. Use Netlify's deploy history to republish the archived pre-launch production deploy.
3. Confirm homepage, forms, indexed service/city URLs, and robots return expected responses.
4. If the incident is domain-direction specific, restore the previous Netlify primary-domain setting temporarily while preserving HTTPS.
5. Verify HubSpot forms and tracking on the restored deployment.
6. Keep test contacts/deals clearly marked; do not delete evidence needed to diagnose duplicate workflow or conversion behavior.
7. Correct the issue in staging, repeat the full launch checklist, and schedule a new cutover.

Rollback must use a known Netlify deploy rather than rebuilding the legacy repository during an incident.
