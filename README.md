# aidvance.xyz, rebuilt for AI search

A rebuild of [aidvance.xyz](https://aidvance.xyz) that AI assistants and search engines can read, understand and cite. See **[AUDIT.md](AUDIT.md)** for what was wrong with the live site and what changed.

## Build

```sh
node build.mjs   # writes the finished site to dist/ (Node 18+, no dependencies)
```

Preview locally with any static server, e.g. `npx serve dist`.

## Where things live

| File | What it holds |
|---|---|
| `src/site.mjs` | Business facts used everywhere: name, one-line summary, location, email, booking link, founder, profile links |
| `src/pages.mjs` | Every page's title, description, body and page-specific structured data |
| `src/faq.mjs` | The FAQ. Shown on /about and published as FAQPage structured data |
| `public/` | Stylesheet (brand kit v1 colors and type), icon, share image |
| `build.mjs` | Page template, structured data, robots.txt, sitemap.xml, llms.txt, llms-full.txt |

Change a fact in `src/site.mjs` or `src/faq.mjs` and every page, the structured data and llms.txt update on the next build.

## Deploying

`vercel.json` tells Vercel to run the build and serve `dist/`. The interactive pieces from the current site (Casey, the Morning Desk demo, the Data Value estimator) still need to be ported in; see "Not done yet" in AUDIT.md.
