# Security headers & Content-Security-Policy

This documents the recommended HTTP security headers for the BTUG site and the
practical constraints of hosting on GitHub Pages.

## GitHub Pages limitation (read this first)

**GitHub Pages cannot set custom HTTP response headers.** You cannot add a real
`Content-Security-Policy`, `Strict-Transport-Security`, or `Referrer-Policy`
response header on plain `*.github.io` hosting. Two viable paths:

1. **`<meta http-equiv>` CSP** — a Content-Security-Policy delivered via a
   `<meta>` tag in the page `<head>`. This works for CSP (with caveats: it
   cannot use `frame-ancestors`, `report-uri`, or sandbox, and it only applies
   to the document, not sub-resources fetched before parse). It is the only
   header-like control available on bare GitHub Pages.
2. **Put a CDN in front (recommended for production)** — serve the site through
   a custom domain behind Cloudflare, Netlify, or Fastly and set the full header
   set there (CSP, HSTS, Referrer-Policy, etc.) as real response headers. This is
   the only way to get HSTS and `frame-ancestors`.

`Strict-Transport-Security` specifically **requires real response headers** and
therefore needs option 2 — a `<meta>` tag cannot deliver HSTS.

## Recommended Content-Security-Policy

Allows: self; Google Forms (`docs.google.com`) framed for embedded RSVP/contact/
conduct forms; Google Fonts (`fonts.googleapis.com` stylesheet +
`fonts.gstatic.com` font files); and Plausible analytics (`plausible.io`).

```
default-src 'self';
base-uri 'self';
object-src 'none';
img-src 'self' data: https:;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
script-src 'self' https://plausible.io;
connect-src 'self' https://plausible.io;
frame-src https://docs.google.com;
form-action 'self' https://docs.google.com;
frame-ancestors 'none';
upgrade-insecure-requests;
```

Notes:
- `style-src` includes `'unsafe-inline'` because Astro inlines critical CSS and
  Google Fonts injects an inline stylesheet link. Tightening this to a nonce/hash
  requires build-time work and a CDN that can rewrite the header per request.
- `frame-ancestors 'none'` and `upgrade-insecure-requests` only take effect via a
  real response header (option 2), not via `<meta>`.

### As a `<meta>` tag (GitHub Pages fallback)

Drop the directives that `<meta>` ignores (`frame-ancestors`):

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; base-uri 'self'; object-src 'none'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self' https://plausible.io; connect-src 'self' https://plausible.io; frame-src https://docs.google.com; form-action 'self' https://docs.google.com; upgrade-insecure-requests" />
```

This would go in `src/layouts/BaseLayout.astro` `<head>` (a structural file —
change it via a CODEOWNERS-reviewed PR).

## Plausible & Subresource Integrity (accepted exception)

The Plausible analytics snippet is loaded from `https://plausible.io/js/script.js`.
Plausible **rotates the contents of that script** to ship improvements without
asking sites to update a hash, so a fixed SRI `integrity` attribute would
intermittently break analytics. We therefore **do not apply SRI to the Plausible
script** — this is a known, accepted exception. We mitigate by:

- pinning the origin in `script-src` / `connect-src` to `https://plausible.io` only, and
- loading it `defer` and privacy-first (no cookies, no PII), so a compromise has
  a limited blast radius.

All other third-party scripts, if any are added later, **must** use SRI.

## Other recommended response headers (via CDN, option 2)

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

- `X-Content-Type-Options: nosniff` — stops MIME-type sniffing.
- `Referrer-Policy: strict-origin-when-cross-origin` — trims referrer leakage.
- `Strict-Transport-Security` — forces HTTPS; **real header only**, needs a CDN.

## Summary

| Header | Bare GitHub Pages | Custom domain + CDN |
|---|---|---|
| CSP | `<meta http-equiv>` (partial) | Full response header |
| X-Content-Type-Options | not settable | yes |
| Referrer-Policy | not settable | yes |
| HSTS | not possible | yes |
| `frame-ancestors` | not via meta | yes |

For a community site embedding Google Forms and using Plausible, the `<meta>`
CSP gives meaningful protection today; moving to a custom domain behind a CDN is
the recommended next step for the full header set.
