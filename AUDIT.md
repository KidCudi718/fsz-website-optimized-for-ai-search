# aidvance.xyz: AI search audit

Audited 2026-10-25 by fetching the live site the way an AI crawler does (plain HTTP, no JavaScript) and searching for "Aidvance" on the open web.

**Bottom line:** the site reads well to a person in a browser, but an AI engine like ChatGPT, Perplexity, Claude or Google AI Overviews gets almost nothing from it. The homepage is close to empty, nothing tells crawlers what's on the site, and three unrelated companies share the name. The rebuild in this repo (`src/`, built to `dist/`) fixes all of the problems below using copy that's already on the site.

## What an AI crawler sees today

The homepage as a crawler receives it, in full:

```
Is AI right for your business?
Bars | Line | Circle
Talk to Casey
Casey is Aidvance's AI business concierge.
See what this looks like in practice · Morning Desk · AI Assessment
```

That's 25 words. The homepage `<title>` is **"Casey · Aidvance"**, so an engine that indexes it learns the site is about something called Casey. "Bars | Line | Circle" is leftover text from the Casey widget's style switcher.

## Findings

| # | Problem | Severity | Evidence | Fixed in rebuild |
|---|---|---|---|---|
| 1 | Homepage has almost no readable text | Critical | 25 words; your actual offer only appears on /about | Homepage now states what Aidvance is, who it's for, the 4 steps and the deliverables in plain HTML |
| 2 | Homepage title is "Casey · Aidvance" | Critical | `<title>` on `/` | "Aidvance Consultancy · Is AI right for your business?" |
| 3 | Same name as 3 other companies | High | Search for "Aidvance" also returns Aidvance Solutions (aidvance.am, Armenia), Aidvance psychotherapy (aidvance.co, Germany) and Aidvanced (Italy) | Always "Aidvance Consultancy, Brooklyn NY, David Choukroun"; schema `disambiguatingDescription`; links to your X and LinkedIn as the same entity (`sameAs`) |
| 4 | No robots.txt | High | `/robots.txt` returns 404 | Present, explicitly allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended and others |
| 5 | No sitemap.xml | High | `/sitemap.xml` returns 404 | Generated from the page list on every build |
| 6 | No llms.txt | Medium | `/llms.txt` returns 404 | `llms.txt` (summary + page index) and `llms-full.txt` (all page text) |
| 7 | No structured data | High | No JSON-LD found | Organization/ProfessionalService, Person (David), Service (AI Assessment), FAQPage (all 14 FAQs), Article, BreadcrumbList |
| 8 | Your best answers are buried | High | The 14-question FAQ is the most quotable content on the site, and it sits at the bottom of /about | Rendered as expandable HTML **and** FAQPage schema from one source file, so they can't drift apart |
| 9 | Morning Desk, Work and Data Value pages are almost empty without JavaScript | Medium | Crawlers see "Open the demo", "Watch how it works" and little else | Each page has a plain-text explanation, with the interactive piece mounting below it |
| 10 | Nav is inconsistent | Low | Data Value is in the nav on some pages but not others; "What We Do" vs "What we do" | One shared nav/footer template |
| 11 | No obvious answer to the questions buyers actually ask an AI | Medium | Nothing answers "should my small business use AI?" | Draft guide at `/guides/should-my-small-business-use-ai/`, built only from statements already on your site. **Review before publishing.** |
| 12 | No canonical URLs, Open Graph tags or share image | Medium | None found | On every page, plus a 1200×630 share image in your brand colors |

## What's good already

- The copy itself is strong for AI search: specific, plain-English, honest ("if it wouldn't help, we'll tell you"). Engines prefer to quote that kind of writing, so the rebuild keeps it word for word.
- Your X bio and LinkedIn headline already say "Founder, Aidvance Consultancy" and link to aidvance.xyz. Those are the strongest outside signals you have, and the schema now points back to them.
- "Is Casey a real person? No." is a good trust signal. Kept.

## Decisions kept as you made them

- **No price on the page.** It says "a fixed fee, agreed in writing, you'll get the number on the call" ("make them ask").
- **No client names.** Morning Desk is described only as "a salesperson at a Manhattan wholesale company."
- **No phone number on the site.** Email and the Calendly link only.

## Not done yet (needs you or the current site's code)

1. **Port the interactive pieces.** The Casey voice widget (Speko), the Morning Desk demo, the Data Value estimator and the explainer videos live in the current site's code, which isn't in this repo. The rebuild leaves marked mount points (`data-casey-mount`, `data-demo-mount`, `data-estimator-mount`) for them, with a working Calendly fallback.
2. **Review the draft guide** (finding 11) before it goes live.
3. **Outside signals** (the biggest lever after the site itself): a Google Business Profile for "Aidvance Consultancy", and the same one-line description on LinkedIn, X and any directory listing, so engines see one consistent entity.
4. **After launch:** submit the sitemap in Google Search Console and Bing Webmaster Tools (Bing feeds ChatGPT search), then ask ChatGPT, Perplexity and Claude "what is Aidvance Consultancy?" once a month to track progress.
