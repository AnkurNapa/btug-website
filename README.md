# BTUG Website

The community website for the **Bengaluru Tableau User Group (BTUG)** — events, speakers, sponsors, learning resources, community stories, a blog, and the annual conference page.

It is a **static site**: there is no application server and no database at runtime. Pages are pre-built and served from GitHub Pages. Non-technical organizers edit content through a CMS UI; everything dynamic (RSVPs, contact, sponsor and newsletter sign-ups) is handled by Google Forms.

If you are an **organizer** (not a developer), you want [`docs/ORGANIZER-RUNBOOK.md`](docs/ORGANIZER-RUNBOOK.md) instead of this file.

---

## Stack, and why

| Layer | Choice | Why |
|---|---|---|
| Site framework | **Astro 5** | Content collections are validated against Zod schemas at build time, so a malformed organizer edit fails the build instead of shipping broken. Astro also ships a **zero-JS baseline** by default — important because a meaningful slice of our audience is on low bandwidth / mobile. |
| Editing | **Decap CMS** (UI at `/admin`) | Gives non-technical organizers a friendly form-based editor. Every save becomes a Git commit, which triggers a rebuild + deploy. No one needs to touch Markdown or YAML by hand. |
| Forms / data capture | **Google Forms + Google Sheets** | GitHub Pages has **no backend**, so there is nowhere to receive a form POST. Google Forms is the pragmatic, free, no-server way to collect RSVPs, contact messages, sponsor enquiries, and newsletter sign-ups. Responses land in a Google Sheet the organizers own. |
| Hosting | **GitHub Pages** | Free static hosting, integrated with the Git history that the CMS already writes to. |
| Analytics | **Plausible** | Lightweight, privacy-friendly, no cookie banner overhead. |

### The `seatsTaken` tradeoff (important)

Because forms are external and the site is static, **Google Forms cannot feed a live RSVP count back into the build.** So the events schema carries a `seatsTaken` number that **organizers update manually** in the CMS after checking the linked Google Sheet. The registration UI (Register / Join waitlist / Sold out) is derived from `capacity`, `seatsTaken`, `waitlistEnabled`, `registrationUrl`, and the event date — see `src/lib/eventState.ts`. This is a deliberate simplicity-over-automation tradeoff; it keeps the whole site backend-free at the cost of a small manual step. The runbook documents the organizer workflow.

---

## Local development

Requires Node 20+.

```bash
npm install      # install dependencies
npm run dev      # start the dev server with hot reload
npm run build    # produce the static site in ./dist (this is what CI runs)
npm run preview  # serve the built ./dist locally to sanity-check a build
npm run check    # astro check — type/content validation without a full build
```

`npm run build` runs the same schema validation that CI runs, so if the build passes locally it will pass in CI.

---

## Folder structure

```
.
├── astro.config.mjs          # Astro config: site URL, base path, YAML plugin
├── .github/workflows/
│   └── deploy.yml            # Build + deploy to GitHub Pages (safe-deploy, see below)
├── public/
│   └── admin/
│       └── index.html        # Decap CMS shell (loads the pinned Decap bundle)
├── docs/                     # Project documentation (this and others)
└── src/
    ├── components/           # Astro UI components (EventCard, SpeakerCard, ...)
    ├── content/
    │   ├── config.ts         # Content collection schemas (the validation layer)
    │   └── events/           # Event entries (Markdown + frontmatter)
    ├── data/
    │   ├── site.yaml         # Global config: nav, socials, chat invites, form links
    │   ├── stats.yaml        # Home-page stats strip numbers
    │   └── conference.yaml   # Conference page data
    ├── layouts/              # Page layout(s)
    ├── lib/
    │   └── eventState.ts     # Registration-state logic (open/waitlist/full/...)
    ├── pages/                # Routed pages (index, about, conference, ...)
    └── styles/               # Global CSS + design tokens
```

---

## How content collections + schemas work

Content lives in **Astro content collections**, each defined and validated in [`src/content/config.ts`](src/content/config.ts) using Zod schemas. The schemas are the **safety net**: Astro validates every Markdown/YAML entry against them at build time, so a malformed edit fails the build (and, thanks to safe-deploy, the last good site stays live).

Collections defined:

- **events** — name, date/endDate (stored and edited as IST), venue, type (`in-person` / `virtual` / `hybrid`), status (`upcoming` / `past` / `cancelled`), capacity, `seatsTaken` (organizer-maintained), `waitlistEnabled`, `registrationUrl` (the Google Form link; absent = "registration not yet open"), and presentation fields (banner, summary, featured, venueChangeBanner).
- **speakers** — name, company, designation, expertise tags, LinkedIn, plus `active` (set to `false` to retire/swap a speaker without deleting history or breaking referencing pages).
- **sponsors** — name, logo, `tier` (platinum / gold / silver / community / partner), url, `active`.
- **blog** — title, date, author, tags, category, excerpt, cover, `draft`.
- **volunteer** — role, capacity, `filledCount`, `filled`, signupUrl, summary (a filled role hides its sign-up CTA).
- **community** — member stories. `optInPublished` **must** be true to render — protects member privacy by never auto-publishing a photo / story / LinkedIn.
- **resources** — title, `kind` (deck / recording / tableau-public / download / link), url, and `linkStatus` (`active` / `expired` / `broken`) which drives a graceful fallback instead of a dead link.

Site-wide config (nav, socials, chat invite links, the Google Form endpoints, analytics domain) lives in `src/data/site.yaml`; home-page stats in `src/data/stats.yaml`.

### Registration state logic

`src/lib/eventState.ts` resolves the single registration state an event card/page renders (`open`, `waitlist`, `full`, `not-configured`, `started`, `cancelled`, `past`) from the event fields and the current time, and maps each to a button label. All times are handled as IST server-side, with each visitor's local time resolved client-side. Note the documented contribution point: the precedence between `started` and `waitlist` (walk-in policy) is intentionally left for the group to decide.

---

## Where the CMS config lives

The Decap CMS shell is `public/admin/index.html`, which loads a **version-pinned** Decap bundle (pinned so a future CDN release can't silently change behavior — see the comments in that file for the upgrade and optional SRI steps). The Decap collection config mirrors the Zod schemas in `src/content/config.ts`, so the editing UI prevents most bad input before it is ever committed. When you add or change a schema field, update the Decap config to match.

---

## How deploy works (safe-deploy-on-failure)

Deployment is handled by [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) on every push to `main` (and manual dispatch). It is split into two jobs:

1. **build** — `npm ci` then `npm run build`, uploading `./dist` as the Pages artifact.
2. **deploy** — declares `needs: build`, so it only runs **after build succeeds**.

The guarantee: if the build fails (bad content, broken config, failed schema validation), the build job goes red, **deploy is skipped entirely, and nothing is published.** The last successfully deployed site stays live and untouched — a broken commit can never take the site down. Concurrency is set so in-progress deploys are allowed to finish rather than being cancelled mid-publish.

Before going public, set the correct `site` (and `base`, if serving from a project path rather than a custom domain) in `astro.config.mjs`.

---

## Other docs

- [`docs/ORGANIZER-RUNBOOK.md`](docs/ORGANIZER-RUNBOOK.md) — non-technical guide for organizers: adding events, updating seats, handling cancellations, privacy, deletion requests, and handoff.
- [`docs/BRANCH-PROTECTION.md`](docs/BRANCH-PROTECTION.md) — branch protection and review settings for the repository.
- [`docs/SECURITY-HEADERS.md`](docs/SECURITY-HEADERS.md) — security headers and related hardening notes.
