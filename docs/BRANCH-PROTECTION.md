# Branch protection & keeping the site alive

This document explains the recommended GitHub settings for the `main` branch and
how they combine with the safe-deploy workflow to guarantee the live site stays
up even when someone pushes a broken change.

## Why this matters

The site deploys automatically from `main` via
[`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml). The workflow
is split into a **build** job and a **deploy** job, and deploy declares
`needs: build`. If the build fails, deploy is skipped and **the previously
published site stays live, untouched**. Branch protection adds a second layer:
it stops a broken build from ever reaching `main` in the first place.

Together:

1. **Branch protection** keeps broken code out of `main` (caught in the PR).
2. **Safe-deploy gating** keeps a broken build from publishing if something
   slips through (caught in CI before deploy).

A contributor would have to defeat both layers to take the site down. The worst
realistic outcome is "the site doesn't update," never "the site goes blank."

## Recommended settings for `main`

In **Settings → Branches → Add branch ruleset** (or classic branch protection),
target `main` and enable:

- **Require a pull request before merging**
  - Require at least **1 approval**.
  - **Require review from Code Owners** (enforces
    [`.github/CODEOWNERS`](../.github/CODEOWNERS) on structural files).
- **Require status checks to pass before merging**
  - Require the **`Build`** check from the deploy workflow.
  - **Require branches to be up to date before merging.**
- **Require conversation resolution before merging.**
- **Do not allow force pushes** (block `--force` to `main`).
- **Do not allow deletions** of `main`.
- **Include administrators** (so the rules apply to everyone).

> The status check only appears in the dropdown after the workflow has run at
> least once. Open one PR first, let CI run, then add `Build` as a required
> check.

## Sitemap (@astrojs/sitemap)

A sitemap helps search engines and is referenced by
[`public/robots.txt`](../public/robots.txt). To generate one:

1. Install the integration:

   ```bash
   npm install @astrojs/sitemap
   ```

2. Register it in `astro.config.mjs` (a structural file — change goes through a
   CODEOWNERS-reviewed PR):

   ```js
   import sitemap from '@astrojs/sitemap';

   export default defineConfig({
     site: 'https://bengaluru-tug.github.io',
     base: '/btug-website',
     integrations: [sitemap()],
     // ...existing config
   });
   ```

3. Astro then emits `sitemap-index.xml` (and `sitemap-0.xml`) at the site root on
   build. With the configured `site` + `base`, the public URL is:

   ```
   https://bengaluru-tug.github.io/btug-website/sitemap-index.xml
   ```

   This is the URL already listed in `public/robots.txt`. Update both if the
   custom domain changes.
