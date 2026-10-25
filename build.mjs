// Builds the static site into dist/. No dependencies: `node build.mjs`.
//
// Every page ships as finished HTML (no client-side rendering needed to read
// it), with its own title, description, canonical URL, Open Graph tags and
// JSON-LD. The build also writes robots.txt, sitemap.xml, llms.txt and
// llms-full.txt from the same content, so they never go stale.

import { mkdirSync, writeFileSync, copyFileSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { SITE, NAV } from './src/site.mjs';
import { PAGES } from './src/pages.mjs';

const OUT = 'dist';
const url = (path) => SITE.origin + path;
// The share image is optional: pages only point to it when public/og.png exists.
const HAS_OG = existsSync(join('public', 'og.png'));
const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// Site-wide entities, referenced by @id from page-level schema.
const orgSchema = {
  '@type': ['Organization', 'ProfessionalService'],
  '@id': `${SITE.origin}/#org`,
  name: SITE.name,
  alternateName: [SITE.shortName, 'aidvance.xyz'],
  url: `${SITE.origin}/`,
  logo: `${SITE.origin}/icon.svg`,
  description: SITE.summary,
  disambiguatingDescription: SITE.disambiguation,
  email: SITE.email,
  founder: { '@id': `${SITE.origin}/#david` },
  address: {
    '@type': 'PostalAddress',
    addressLocality: SITE.locality,
    addressRegion: SITE.region,
    addressCountry: SITE.country,
  },
  areaServed: SITE.areaServed,
  knowsAbout: ['Artificial intelligence for small businesses', 'Business process automation', 'AI readiness assessment'],
  makesOffer: { '@type': 'Offer', itemOffered: { '@id': `${SITE.origin}/ai-assessment/#service` } },
  sameAs: SITE.sameAs,
};

const personSchema = {
  '@type': 'Person',
  '@id': `${SITE.origin}/#david`,
  name: SITE.founder.name,
  jobTitle: SITE.founder.jobTitle,
  worksFor: { '@id': `${SITE.origin}/#org` },
  description: SITE.founder.bio,
  url: `${SITE.origin}/about/#david`,
  homeLocation: { '@type': 'Place', name: 'Brooklyn, New York' },
  sameAs: SITE.founder.sameAs,
};

const websiteSchema = {
  '@type': 'WebSite',
  '@id': `${SITE.origin}/#website`,
  url: `${SITE.origin}/`,
  name: SITE.name,
  publisher: { '@id': `${SITE.origin}/#org` },
  inLanguage: 'en-US',
};

function breadcrumbs(page) {
  if (page.path === '/') return null;
  const trail = [{ path: '/', crumb: 'Home' }];
  if (page.parent) trail.push(page.parent);
  trail.push({ path: page.path, crumb: page.crumb });
  return trail;
}

function jsonLd(page) {
  const graph = [orgSchema, personSchema, websiteSchema, ...page.schema(page)];
  const trail = breadcrumbs(page);
  if (trail) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.crumb, item: url(t.path) })),
    });
  }
  // Escape "<" so page text can never close the script tag.
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 1).replace(/</g, '\\u003c');
}

function render(page) {
  const trail = breadcrumbs(page);
  const nav = NAV.map(
    (n) => `<a href="${n.href}"${n.href === page.path || (n.href !== '/' && page.path.startsWith(n.href)) ? ' aria-current="page"' : ''}>${n.label}</a>`
  ).join('');
  const crumbHtml = trail
    ? `<nav class="crumbs" aria-label="Breadcrumb">${trail
        .map((t, i) => (i === trail.length - 1 ? `<span aria-current="page">${t.crumb}</span>` : `<a href="${t.path}">${t.crumb}</a>`))
        .join(' / ')}</nav>`
    : '';

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${attr(page.title)}</title>
<meta name="description" content="${attr(page.description)}">
<link rel="canonical" href="${url(page.path)}">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:title" content="${attr(page.title)}">
<meta property="og:description" content="${attr(page.description)}">
<meta property="og:url" content="${url(page.path)}">
${HAS_OG ? `<meta property="og:image" content="${SITE.origin}/og.png">\n<meta name="twitter:card" content="summary_large_image">` : '<meta name="twitter:card" content="summary">'}
<meta name="twitter:site" content="@DCBK2LA">
<meta name="theme-color" content="#050505">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="alternate" type="text/markdown" title="LLM-readable summary" href="/llms.txt">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@600&family=IBM+Plex+Sans:wght@400;600&family=Newsreader:opsz,wght@6..72,400&display=swap">
<link rel="stylesheet" href="/styles.css">
<script type="application/ld+json">${jsonLd(page)}</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <a class="wordmark" href="/" aria-label="Aidvance Consultancy, home"><span>AIDVANCE</span><small>CONSULTANCY</small></a>
  <nav class="site-nav" aria-label="Main">${nav}</nav>
  <a class="btn btn-primary btn-sm" href="/#casey">Talk to Casey</a>
</header>
<main id="main">
${crumbHtml}
${page.body}
</main>
<footer class="site-footer">
  <p class="footer-cta">Is AI right for your business? <a href="${SITE.bookingUrl}">Book a free 15-minute call</a></p>
  <p><strong>${SITE.name}</strong> · ${SITE.locality}, ${SITE.region} · <a href="mailto:${SITE.email}">${SITE.email}</a> · <a href="https://x.com/DCBK2LA" rel="me">X</a> · <a href="https://www.linkedin.com/in/davidchoukroun" rel="me">LinkedIn</a></p>
  <p class="fine">${SITE.disambiguation}</p>
  <p class="fine">Updated <time datetime="${page.updated}">${page.updated}</time> · <a href="/guides/should-my-small-business-use-ai/">Should my small business use AI?</a> · <a href="/data-value/">Data value</a> · <a href="/llms.txt">llms.txt</a></p>
</footer>
</body>
</html>
`;
}

function write(path, content) {
  const file = join(OUT, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}

// Named AI crawlers are listed explicitly so the intent is unambiguous to
// anyone reading the file; the wildcard already allows everything.
const AI_BOTS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
  'ClaudeBot', 'Claude-User', 'Claude-SearchBot',
  'PerplexityBot', 'Perplexity-User',
  'Google-Extended', 'Applebot-Extended', 'Bingbot', 'CCBot',
];

const robots = `# aidvance.xyz: search engines and AI assistants are welcome to read and cite this site.
User-agent: *
Allow: /

${AI_BOTS.map((b) => `User-agent: ${b}\nAllow: /`).join('\n\n')}

Sitemap: ${SITE.origin}/sitemap.xml
`;

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map((p) => `  <url><loc>${url(p.path)}</loc><lastmod>${p.updated}</lastmod></url>`).join('\n')}
</urlset>
`;

const llms = `# ${SITE.name}

> ${SITE.summary}

${SITE.disambiguation}

Key facts:
- Service: the AI Assessment, a 90-minute session on how the business actually runs, then a review call within five business days with a plan: what to fix first, what to leave alone, what isn't worth automating.
- Price: a fixed fee agreed in writing before work starts, shared on the free call. No hourly billing.
- First step: a free 15-minute fit call (${SITE.bookingUrl}) or a conversation with Casey, the site's AI concierge.
- For: owners of small service businesses (practices, trades, firms, shops).
- Independent: Aidvance does not sell software. The advice is the product.
- Founder: ${SITE.founder.name}, Brooklyn, NY. Almost a decade selling online advertising to small and medium-sized service businesses.
- Contact: ${SITE.email}

## Pages

${PAGES.map((p) => `- [${p.h1}](${url(p.path)}): ${p.description}`).join('\n')}

## Optional

- [Full text of every page](${SITE.origin}/llms-full.txt)
`;

const llmsFull = `# ${SITE.name}: full site text

> ${SITE.summary}

${SITE.disambiguation}

${PAGES.map((p) => `---\nSource: ${url(p.path)}\n\n${p.markdown}`).join('\n\n')}
`;

rmSync(OUT, { recursive: true, force: true });
for (const page of PAGES) write(page.path.endsWith('/') ? page.path + 'index.html' : page.path, render(page));
write('404.html', render({
  path: '/404.html', title: 'Page not found · Aidvance', description: 'This page does not exist.', h1: 'Page not found', crumb: 'Not found',
  updated: PAGES[0].updated, schema: () => [],
  body: `<h1>Page not found</h1><p class="lede">That page doesn't exist. Try the <a href="/">homepage</a> or <a href="/about/#faq">the FAQ</a>.</p>`,
}).replace('content="index, follow, max-snippet:-1, max-image-preview:large"', 'content="noindex"'));
write('robots.txt', robots);
write('sitemap.xml', sitemap);
write('llms.txt', llms);
write('llms-full.txt', llmsFull);
for (const f of ['styles.css', 'icon.svg', ...(HAS_OG ? ['og.png'] : [])]) copyFileSync(join('public', f), join(OUT, f));

console.log(`Built ${PAGES.length} pages + 404, robots.txt, sitemap.xml, llms.txt, llms-full.txt into ${OUT}/`);
