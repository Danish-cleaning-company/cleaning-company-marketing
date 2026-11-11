# Netlify Staging Deployment Guide

This procedure creates an isolated staging site from the static artifact. It must not be connected to the existing production site, production domains, or production deploy pipeline.

## 1. Build and inspect locally

From `Website-Next/`:

```sh
npm ci
npm run build:staging
```

Publish `staging-out/`, not `out/` and not the repository root. Before upload, confirm:

```sh
test -f staging-out/index.html
test -f staging-out/_headers
test -f staging-out/_redirects
cat staging-out/robots.txt
```

The robots output must contain `Disallow: /`. Every HTML page must also contain `noindex, nofollow, noarchive, nosnippet`, and `_headers` must apply an equivalent `X-Robots-Tag` header.

## 2. Create a separate Netlify site

1. Sign in to the Netlify team that owns the website.
2. Select **Add new project**, then **Deploy manually**.
3. Upload the generated `staging-out/` directory.
4. Give the new project an unmistakable staging name, such as `kolding-rengoering-next-staging`.
5. Keep the generated `*.netlify.app` address. Do not add either production hostname.
6. Do not connect this staging project to the production Git repository or production branch.
7. Confirm the new project's deploy and domain settings are independent from the existing production project.

Manual deployment is intentional for the first QA cycle: it prevents a Git push, branch setting, or framework autodetection from changing the production pipeline.

## 3. Restrict access

Prefer private project visibility or team-login protection. Availability and labels depend on the Netlify plan.

1. Open the staging project.
2. Go to **Project configuration > General > Visitor access**.
3. Set project visibility to private or configure Password Protection for all deploys.
4. Grant access only to the QA participants.
5. If the plan does not support suitable protection, do not treat robots directives as access control. Obtain approval for another protected staging method before uploading applicant test data.

Password or team-login protection may prevent external metadata and crawler-based testing tools from reaching the site. Temporarily changing access for a specific approved test window requires separate approval.

## 4. Verify indexing protection

After deployment, use the staging URL to verify:

```sh
curl -I https://STAGING-SITE.netlify.app/
curl https://STAGING-SITE.netlify.app/robots.txt
curl -s https://STAGING-SITE.netlify.app/ | grep -i noindex
```

Required results:

- The page response includes `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet`.
- `robots.txt` contains `User-agent: *` and `Disallow: /`.
- Page HTML contains the noindex meta directive.
- Canonical links continue to use the configured production hostname, never the staging hostname.

Do not add the staging hostname to Search Console and do not submit its sitemap.

## 5. Verify routes and redirects

Test the homepage, all five services, all three cities, job, privacy, and both thank-you pages. Confirm the draft rules in `_redirects` work on staging, especially:

- `/byer/{city}` to `/{city}`
- `.html` service and form routes to extensionless routes
- privacy-policy variants to `/privatlivspolitik`
- trailing-slash variants to routes without trailing slashes

These staging rules do not alter production redirects or domain direction.

## 6. Test HubSpot and analytics safely

1. Confirm the approved staging hostname is covered by the existing HubSpot consent banner. If a HubSpot portal change is required, document it and obtain approval first.
2. Test direct loads and client-side navigation before submitting forms.
3. Obtain approval before creating production HubSpot test contacts. Use unmistakable test names and emails and a harmless test CV.
4. Verify Sales Prospect creates only the intended sales classification, workflow, deal, `Lead`, and Google Ads conversion.
5. Verify Job Candidate creates the recruitment classification, accepts the CV, creates no sales deal/workflow, and emits only `RecruitmentApplication`.
6. Exercise accept-all, reject-all, granular consent, withdrawal, and returning-visitor states.
7. Use GA4 DebugView, Google Tag Assistant, and Meta Test Events/Pixel Helper. Confirm no non-essential request occurs before applicable consent and no event contains applicant data.
8. Record and remove approved HubSpot test contacts, files, deals, and workflow enrollments after QA.

Because staging uses the existing production integration IDs, test events may appear in production analytics properties even though the website deployment is isolated.

## 7. Keep production isolated

- Do not add `kolding-rengoering.dk` or `www.kolding-rengoering.dk` to the staging project.
- Do not change DNS, Netlify primary-domain settings, production redirects, tracking IDs, HubSpot workflows, or consent configuration without separate approval.
- Do not promote the staging deploy to the existing production project.
- Production deployment must use `out/`; `staging-out/` intentionally contains noindex controls and must never be used for launch.

## 8. Update staging

For each QA revision, run `npm run build:staging` again and upload the newly generated `staging-out/` directory from the staging project's **Deploys** page. Record the deploy ID used for each test pass.

## Official references

- [Add a new Netlify project and deploy local files](https://docs.netlify.com/manage/projects/add-new-project/)
- [Netlify deploy protection](https://docs.netlify.com/deploy/protect-deploys/)
- [Netlify password protection](https://docs.netlify.com/manage/security/secure-access-to-sites/password-protection/)
