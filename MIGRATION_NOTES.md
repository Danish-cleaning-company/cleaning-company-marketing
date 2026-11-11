# Migration Notes

## Phase 4 HubSpot and analytics (2026-11-10)

### Production integration audit

- HubSpot portal: `146906456` (`eu1`).
- Sales Prospect form: `84085022-4b4d-49d6-b5e9-c25a24dd277b`; embedded on the homepage, five service pages, and three location pages with HubSpot's `forms/embed/146906456.js` frame embed.
- Job Candidate form: `d9b1a805-ecd8-475a-a4ae-806d6c15f4c4`; embedded on `/job` with the same frame method.
- The original recruitment script listens for `hs-form-event:on-submission:success`, stores a 30-minute session marker, and redirects to `/job-thank-you.html`. The migrated destination is the canonical `/job-thank-you`.
- The original sales form relies on the HubSpot-configured confirmation destination. The original `/thank-you.html` emits Meta `Lead` and Google Ads conversion `AW-17515658494/b_iACLmniaocEP75jqBB` solely from the URL, allowing direct visits and refreshes to create false conversions. Phase 4 replaces this with the same confirmed-submission marker model used for recruitment.
- HubSpot tracking/consent script: `https://js-eu1.hs-scripts.com/146906456.js`.
- Consent API: `_hsp.push(["addPrivacyConsentListener", callback])`; cookie preferences reopen with `_hsp.push(["showBanner"])`.
- GA4 measurement ID: `G-LWF59KVR0L`.
- Google Ads ID: `AW-17515658494`; sales conversion destination: `AW-17515658494/b_iACLmniaocEP75jqBB`.
- Meta Pixel ID: `999143794978535`.
- Original Meta route events are `PageView`, `ViewContent`, and on selected service/location/legal pages `Contact`. Sales confirmation uses standard `Lead`; recruitment confirmation uses custom `RecruitmentApplication` with an event ID.
- Original duplicate protection exists for Meta initialization, custom recruitment IDs, and recruitment session markers. It did not protect the sales Meta/Google conversion from confirmation-page refreshes.

### Implemented consent and loading behavior

- HubSpot remains the consent provider; it was not replaced.
- HubSpot tracking is loaded once globally so the consent banner and HubSpot analytics continue to function.
- Google Consent Mode defaults to denied before any Google tag is requested. The Google tag is loaded only after analytics or advertisement consent, with GA4 and Ads configured only for their respective consent category.
- Meta's library and Pixel initialization occur only after HubSpot advertisement consent. Withdrawal sends Meta consent revoke and Google Consent Mode denied updates.
- The footer Cookie Settings button reopens the HubSpot banner.
- GA4, Meta, and HubSpot pageviews support Next.js App Router navigation. Meta PageView uses `fbq("track", "PageView")`, never `trackCustom`.
- Script and initialization state is stored globally to survive client-side navigation and React development remounts without duplicate loaders or Pixel initialization.

### Forms, categories, and destinations

- `Sales Prospect` maps to `sales_lead`, the production sales form, `/thank-you`, Meta `Lead`, and the existing Google Ads sales destination.
- `Job Candidate` maps to `recruitment_application`, the production recruitment form, `/job-thank-you`, and Meta custom `RecruitmentApplication`. It never emits Meta `Lead` or the Google Ads sales conversion.
- `Existing Customer` maps to `existing_customer_enquiry`, but no dedicated production form ID, success route, HubSpot property, or conversion was found.
- `Subcontractor` maps to `subcontractor_application`, but no dedicated production form ID, success route, HubSpot property, or conversion was found.
- Existing production form IDs preserve their current HubSpot fields and hidden properties because the forms themselves were not recreated or modified.
- Deal creation and CRM workflows are controlled in HubSpot, not this repository. The portal workflows must be reviewed before launch to verify that only Sales Prospect submissions create sales deals.

### Conversion reliability

- Only `hs-form-event:on-submission:success` creates a confirmation marker and redirects. Failed or incomplete submissions do not create markers.
- Markers contain only purpose, form ID, timestamp, and random event ID. Applicant/contact field values are never sent to analytics or diagnostic logs.
- Confirmation pages validate purpose, production form ID, and a 30-minute lifetime, then remove the marker before requesting a conversion.
- Direct confirmation-page visits and refreshes have no marker and do not emit conversion events.
- In-memory event-ID sets prevent repeated Meta or Google conversion requests during the same document lifecycle. Meta receives the event ID for platform-side deduplication.
- Confirmed events wait in memory when advertisement consent is absent and are emitted only if consent is later granted during the same page visit.

### Verification

- Dependency-free simulated tracking checks cover denied consent, analytics-only consent, advertisement consent, standard Meta PageView, sales/recruitment separation, client-side route pageviews, expired/incorrect markers, and duplicate event IDs.
- No production HubSpot submissions were made. This avoids creating contacts, applications, deals, or workflow activity in the live portal.
- The public HubSpot forms embed was inspected and uses a `MutationObserver`, allowing a single embed loader to discover frames added by client-side navigation.
- ESLint, standalone TypeScript, production build, static export, and generated-file audits are required after this section's implementation and recorded in the completion report.

### Approval and manual browser checks still required

- Confirm in HubSpot that the two forms' hidden contact classification properties and post-submission settings still match Sales Prospect and Job Candidate.
- Confirm the Sales Prospect workflow creates the intended deal and that Job Candidate submissions cannot enter sales deal workflows.
- Create or approve dedicated HubSpot forms/properties/workflows before enabling Existing Customer or Subcontractor categories.
- In a staging/preview deployment on an allowed HubSpot domain, submit one test Sales Prospect and one test Job Candidate form, verify canonical redirects, uploaded CV behavior, contact classification, and exactly one intended conversion.
- Test accept, reject, granular category selection, reopening settings, and withdrawal against the portal's live HubSpot consent banner configuration.
- Verify GA4 DebugView, Google Tag Assistant, Meta Pixel Helper/Test Events, and HubSpot page analytics during client-side navigation. These require real browser/network access and should not be inferred from static tests.

## Phase 3 public-page migration (2026-11-10)

- Migrated the five original service pages to `/services/[service]` using typed content and a flexible shared renderer.
- Migrated Egtved, Haderslev, and Vejle to the agreed root-level location routes while preserving the source copy for each city.
- Migrated `/job`, `/privatlivspolitik`, `/thank-you`, and `/job-thank-you`.
- `/kontakt` and `/faa-tilbud` remain explicit `noindex` placeholders because no standalone equivalents exist in the original website.
- HubSpot forms, consent management, GA4, Google Ads, and Meta Pixel remain inactive. Form containers preserve the correct sales/recruitment purpose and IDs for Phase 4.
- Confirmation pages are `noindex, nofollow` and intentionally omitted from the sitemap.
- The privacy notice remains in English because that is the only source policy. Its broken `info@kolding-rengoerig.dk` address and non-`www` site URL were corrected during migration.
- Original city pages contain substantially templated long-form copy and unverified statements about environmental products and customer praise. The text was preserved, not expanded; content/legal review is recommended before launch.
- The original summer-house structured data advertised package prices that conflict with the visible `340 kr.` hourly price. Those unsupported package offers were removed from the migrated JSON-LD.
- The original kontor page heading says “til dit hjem” despite describing office cleaning. It remains unchanged pending editorial approval.

### Additional legacy redirects required

- `/thank-you.html` -> `/thank-you`
- `/job-thank-you.html` -> `/job-thank-you`
- `/job.html` -> `/job`
- `/services/institutioner.html` -> `/services/institutioner`
- `/services/restauranter.html` -> `/services/restauranter`
- `/services/kontor.html` -> `/services/kontor`
- `/services/solarium.html` -> `/services/solarium`
- `/services/sommerhus.html` -> `/services/sommerhus`

Audit date: 2026-11-10

The existing sibling `Website/` repository was inspected read-only. This project is a technical foundation only; no production deployment or hosting changes were made.

## Existing routes

| Source file | Public route implied by current Apache rules | Current canonical |
| --- | --- | --- |
| `index.html` | `/` | `https://kolding-rengoering.dk` |
| `services/institutioner.html` | `/services/institutioner` | non-`www`, same path |
| `services/restauranter.html` | `/services/restauranter` | non-`www`, same path |
| `services/kontor.html` | `/services/kontor` | `www`, same path |
| `services/solarium.html` | `/services/solarium` | non-`www`, same path |
| `services/sommerhus.html` | `/services/sommerhus` | non-`www`, same path |
| `byer/egtved/index.html` | `/byer/egtved/` | `/egtved/` |
| `byer/haderslev/index.html` | `/byer/haderslev/` | `/haderslev/` |
| `byer/vejle/index.html` | `/byer/vejle/` | `/vejle/` |
| `job.html` | `/job` | `/job` |
| `job-thank-you.html` | `/job-thank-you` | `/job-thank-you` |
| `thank-you.html` | `/thank-you` | `/thank-you` |
| `privacy-policy.html` | `/privacy-policy` | `/services/privacy-policy` |

The requested foundation routes `/kontakt` and `/faa-tilbud` do not exist in the current site. They are excluded from the generated sitemap and marked `noindex, nofollow` until their final content and URL strategy are approved.

## URL decisions still required

- Apache currently redirects non-`www` traffic toward `www`, but most canonicals and sitemap URLs use non-`www`.
- The Apache non-`www` redirect target uses `http://www...`; an earlier HTTPS rule may cause an extra redirect.
- Location sitemap URLs use `/byer/{city}/`, while location canonicals use `/{city}/`.
- The privacy-policy file, public route, and canonical path disagree.
- Existing URLs mix trailing-slash conventions.

The foundation preserves recorded canonical and sitemap values rather than silently choosing replacements. Resolve these points using production redirect checks and Google Search Console data before launch.

## Navigation and design

- Header navigation exposes services, pricing, and contact. Job is linked from the footer.
- Footer contains service links, Kolding/Egtved/Haderslev/Vejle location links, social links, privacy policy, and Job.
- Existing styles are split between `src/style/global.css`, `src/style/global-services.css`, and `src/style/index.css`.
- Existing assets are under `src/images/` and `favicon/`.
- No existing design, customer logos, testimonials, or detailed page copy has been migrated in this phase.
- `siteConfig.logos` records future public paths. Logo assets still need an approved copy/optimization pass.

## Forms and integrations

Current identifiers recorded in `src/config/site.ts`:

- GA4: `G-LWF59KVR0L`
- Google Ads: `AW-17515658494`
- Existing sales conversion destination: `AW-17515658494/b_iACLmniaocEP75jqBB`
- Meta Pixel: `999143794978535`
- HubSpot portal: `146906456`
- HubSpot sales form: `84085022-4b4d-49d6-b5e9-c25a24dd277b`
- HubSpot recruitment form: `d9b1a805-ecd8-475a-a4ae-806d6c15f4c4`

The existing tracking script:

- Starts Google consent in a denied state.
- Updates consent from HubSpot analytics and advertisement categories.
- Initializes Meta only after advertisement consent.
- Uses standard Meta events for `PageView`, `ViewContent`, `Contact`, and `Lead`.
- Uses a consent-aware, deduplicated `RecruitmentApplication` custom event.
- Preserves a one-time recruitment success marker across the redirect.

All Next.js integration components are inactive placeholders. They load no external scripts, set no cookies, and emit no events.

Conversion purposes are explicitly separated as:

- Sales lead
- Recruitment application
- Existing customer enquiry
- Subcontractor application

## Sitemap and robots

The current sitemap includes the homepage, five services, three locations, and Job. It excludes thank-you and privacy pages. The foundation reproduces that route set.

The current robots file points to the `www` sitemap URL and disallows `/server/`, `/scripts/`, `/private/`, `/test/`, and `/tmp/`. The foundation preserves those values pending hostname approval.

## Recommended next step

Approve the definitive hostname, location URL pattern, privacy-policy route, and trailing-slash policy. Then migrate the shared visual shell and one representative service page, validating design, metadata, consent, and static output before expanding the templates.

## Local path constraint

The parent business directory contains a colon (`I:S`). npm prepends `node_modules/.bin` to `PATH`, where the colon is interpreted as a path separator. Project scripts therefore invoke the installed JavaScript CLI entry points explicitly through `node` so `npm run dev`, `lint`, `typecheck`, and `build` work from the required sibling location.

## Finalized URL architecture (approved 2026-11-10)

- Canonical hostname: `https://www.kolding-rengoering.dk`
- Location routes: `/{city}`
- Privacy policy: `/privatlivspolitik`
- Canonical URLs have no trailing slash.
- `src/app/[city]/page.tsx` generates only typed location slugs and sets `dynamicParams = false`.
- A reserved-root guard prevents location records from using `job`, `kontakt`, `faa-tilbud`, `privatlivspolitik`, `services`, `robots.txt`, or `sitemap.xml`.
- Next.js static routes take precedence over the root dynamic segment.

### Redirects required at production cutover

These redirects must be implemented and tested in the deployment/hosting layer later. Production redirect configuration has not been changed.

- `http://kolding-rengoering.dk/*` -> `https://www.kolding-rengoering.dk/*`
- `https://kolding-rengoering.dk/*` -> `https://www.kolding-rengoering.dk/*`
- `/index.html` -> `/`
- `/byer/egtved`, `/byer/egtved/`, and `/byer/egtved/index.html` -> `/egtved`
- `/byer/haderslev`, `/byer/haderslev/`, and `/byer/haderslev/index.html` -> `/haderslev`
- `/byer/vejle`, `/byer/vejle/`, and `/byer/vejle/index.html` -> `/vejle`
- `/egtved/`, `/haderslev/`, and `/vejle/` -> their no-trailing-slash forms
- `/privacy-policy`, `/privacy-policy.html`, and `/services/privacy-policy` -> `/privatlivspolitik`
- Existing flat `.html` routes, including `/job.html` and `/services/{service}.html`, -> extensionless equivalents.
- Equivalent trailing-slash routes -> no-trailing-slash equivalents.

Thank-you routes require a separate migration decision before redirect rules are finalized because they are conversion endpoints.

## Phase 2 shared shell and homepage

Migrated on 2026-11-10:

- Shared responsive header and service navigation
- Shared footer, contact information, location links, social links, payment marks, privacy link, and Job link
- Homepage hero, services, partner carousel, desktop feature sections, pricing, contact region, reviews, about section, and mobile call button
- Original homepage imagery, logos, favicon assets, color palette, typography, spacing, and responsive rules
- Homepage metadata and LocalBusiness JSON-LD using the finalized `www` hostname

HubSpot forms, HubSpot consent, GA4, Google Ads, and Meta Pixel remain inactive typed placeholders. The visible cookie-settings control is also inert until the integration phase. No external tracking script is loaded.
