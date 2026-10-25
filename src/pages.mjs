// Page content. Copy is carried over from the live aidvance.xyz pages; the
// additions are answer-first intros and plain-text versions of things the
// live site only showed inside interactive widgets.
//
// Each page: path, title (<title>), description (meta + llms.txt), h1,
// crumb (breadcrumb label), body (HTML), schema(), updated (ISO date),
// and markdown (plain version used for llms-full.txt).

import { SITE } from './site.mjs';
import { FAQ } from './faq.mjs';

const UPDATED = '2026-10-25';

const bookCta = `
<div class="cta-row">
  <a class="btn btn-primary" href="${SITE.bookingUrl}">Book a free 15-minute call with Dave</a>
  <a class="btn btn-secondary" href="/#casey">Talk to Casey</a>
</div>
<p class="fine">Start with the free 15-minute fit call. If there is nothing worth assessing, we'll know quickly.</p>`;

const steps = [
  ['Start with a conversation.', 'Talk to Casey on the homepage, or book a free 15-minute call.'],
  [
    'The AI Assessment.',
    "A 90-minute sit-down. We look at where your business is today, where you want it to be, and what's standing between the two. You talk, we handle everything after that.",
  ],
  [
    'The review call.',
    "Within five business days, we get back together and walk through everything we found: what to fix first, what to leave alone, and what isn't worth automating. You don't just get an email. You get the conversation.",
  ],
  [
    "From there, it's your call.",
    'Act on the plan with us, with someone else, or on your own. Either way, you now have someone who knows your business and knows AI, whenever a new question comes up.',
  ],
];

const deliverables = [
  ['Clear map', 'Where the friction is and what matters most.'],
  ['Specific recommendations', 'What should change and what type of solution fits.'],
  ['Easy wins', 'Simple fixes your team can implement now.'],
  ['Bigger opportunities', 'Anything that needs a real build, clearly scoped before you decide.'],
];

const stepsHtml = `<ol class="steps">${steps
  .map(([t, d], i) => `<li><span class="num">0${i + 1}</span><h3>${t}</h3><p>${d}</p></li>`)
  .join('')}</ol>`;

const deliverablesHtml = `<ul class="cards">${deliverables
  .map(([t, d]) => `<li class="card"><h3>${t}</h3><p>${d}</p></li>`)
  .join('')}</ul>`;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const faqHtml = FAQ.map(
  (g) => `<h3 class="label">${g.group}</h3>
<div class="faq">${g.items
    .map((i) => `<details><summary>${esc(i.q)}</summary><p>${esc(i.a)}</p></details>`)
    .join('')}</div>`
).join('');

const assessmentService = {
  '@type': 'Service',
  '@id': `${SITE.origin}/ai-assessment/#service`,
  name: 'AI Assessment',
  serviceType: 'AI readiness assessment for small businesses',
  description:
    'A 90-minute working session on how a small service business actually runs, followed within five business days by a review call and a written plan showing where AI belongs, where it does not, and what to do first.',
  provider: { '@id': `${SITE.origin}/#org` },
  areaServed: SITE.areaServed,
  audience: {
    '@type': 'BusinessAudience',
    audienceType: 'Owners of small service businesses: practices, trades, firms and shops',
  },
  termsOfService: 'Fixed fee, agreed in writing before work starts. No hourly billing.',
};

export const PAGES = [
  {
    path: '/',
    title: 'Aidvance Consultancy · Is AI right for your business?',
    description:
      'Aidvance Consultancy helps small service business owners find out where AI actually saves time or money, and where it does not. Book a free 15-minute call.',
    h1: 'Is AI right for your business?',
    updated: UPDATED,
    body: `
<section class="hero">
  <p class="label">Aidvance Consultancy · Brooklyn, NY</p>
  <h1>Is AI right for your business?</h1>
  <p class="lede">Aidvance helps owners of small service businesses figure out where AI actually saves them time or money, and where it doesn't. Before you spend a dollar on a tool.</p>
  <div class="cta-row">
    <a class="btn btn-primary" href="#casey">Talk to Casey</a>
    <a class="btn btn-secondary" href="${SITE.bookingUrl}">Book a free 15-minute call</a>
  </div>
</section>

<section id="casey" class="casey" aria-labelledby="casey-h">
  <h2 id="casey-h">Talk to Casey</h2>
  <p>Casey is Aidvance's AI business concierge. She answers questions about how this works and can book your free call with Dave. She'll always tell you she's an AI if you ask.</p>
  <!-- The live Casey voice widget (Speko) mounts here. Without JavaScript, the link below still works. -->
  <div id="casey-widget" class="casey-widget" data-casey-mount>
    <a class="btn btn-primary" href="${SITE.bookingUrl}">Book the free call instead</a>
  </div>
</section>

<section aria-labelledby="who-h">
  <h2 id="who-h">Who it's for</h2>
  <p>Owners of small service businesses (practices, trades, firms, shops) who are doing real work, feel stretched, and keep hearing they "should be using AI" without anyone telling them where.</p>
</section>

<section aria-labelledby="how-h">
  <h2 id="how-h">How it works</h2>
  ${stepsHtml}
</section>

<section aria-labelledby="get-h">
  <h2 id="get-h">What you get</h2>
  ${deliverablesHtml}
  <p><a href="/ai-assessment/">What actually is an AI Assessment? →</a></p>
</section>

<section aria-labelledby="see-h">
  <h2 id="see-h">See what this looks like in practice</h2>
  <p><a href="/work/morning-desk/">Morning Desk</a>: a sales dashboard built on a salesperson's email inbox, so the inbox does the work. <a href="/data-value/">What's your data worth?</a>: a quick estimate of what AI companies pay for business data like yours.</p>
</section>`,
    schema: () => [
      {
        '@type': 'WebPage',
        '@id': `${SITE.origin}/#webpage`,
        url: `${SITE.origin}/`,
        name: 'Aidvance Consultancy · Is AI right for your business?',
        about: { '@id': `${SITE.origin}/#org` },
        isPartOf: { '@id': `${SITE.origin}/#website` },
      },
    ],
    markdown: `# Aidvance Consultancy: Is AI right for your business?

${SITE.summary}

## Who it's for
Owners of small service businesses (practices, trades, firms, shops) who are doing real work, feel stretched, and keep hearing they "should be using AI" without anyone telling them where.

## How it works
${steps.map(([t, d], i) => `${i + 1}. **${t}** ${d}`).join('\n')}

## What you get
${deliverables.map(([t, d]) => `- **${t}:** ${d}`).join('\n')}

## Talk to Casey
Casey is Aidvance's AI business concierge on the homepage. She answers questions and can book a free 15-minute call with Dave. Booking link: ${SITE.bookingUrl}`,
  },

  {
    path: '/what-we-do/',
    title: "What we do · We don't start with AI · Aidvance",
    description:
      "Aidvance starts with the business, not the AI: listen to how the work moves, judge what is worth automating and what isn't, then recommend what to fix first.",
    h1: "We don't start with AI.",
    crumb: 'What we do',
    updated: UPDATED,
    body: `
<p class="label">What we do</p>
<h1>We don't start with AI.</h1>
<p class="lede">We start with the business. We show how the work moves, find where time, attention, leads, and information get lost, and say what is worth automating, what isn't, and what comes first.</p>
<ol class="steps">
  <li><span class="num">01</span><h2>Listen</h2><p>How the work actually moves. The handoffs, the inbox, the desk, the load.</p></li>
  <li><span class="num">02</span><h2>Judge</h2><p>Where time, attention, leads, and information get lost. What is worth automating. What is not.</p></li>
  <li><span class="num">03</span><h2>Recommend</h2><p>What to fix first. What to leave alone. What needs a specialist to implement.</p></li>
</ol>
<p>A business may think it needs a new AI tool. We may find that the real issue is a process nobody owns, software they already pay for, or something that should not be automated at all.</p>
<p><a href="/work/">See how this played out in real work →</a></p>
${bookCta}`,
    schema: () => [],
    markdown: `# What we do: We don't start with AI.

We start with the business. We show how the work moves, find where time, attention, leads, and information get lost, and say what is worth automating, what isn't, and what comes first.

1. **Listen.** How the work actually moves. The handoffs, the inbox, the desk, the load.
2. **Judge.** Where time, attention, leads, and information get lost. What is worth automating. What is not.
3. **Recommend.** What to fix first. What to leave alone. What needs a specialist to implement.

A business may think it needs a new AI tool. We may find that the real issue is a process nobody owns, software they already pay for, or something that should not be automated at all.`,
  },

  {
    path: '/ai-assessment/',
    title: 'What is an AI Assessment? · 90 minutes, a plan in 5 days · Aidvance',
    description:
      'An AI Assessment is a 90-minute session on how your business actually works, then a review call within five business days showing where AI belongs, where it does not, and what to do first.',
    h1: 'What actually is an AI Assessment?',
    crumb: 'AI assessment',
    updated: UPDATED,
    body: `
<p class="label">AI assessment</p>
<h1>What actually is an AI Assessment?</h1>
<p class="lede">We spend 90 minutes learning how your business actually works, then show you where AI belongs, where it doesn't, and what to do first.</p>
<dl class="facts">
  <div><dt>Your time</dt><dd>A 90-minute session, then the review call</dd></div>
  <div><dt>Turnaround</dt><dd>Review call within five business days</dd></div>
  <div><dt>Price</dt><dd>A fixed fee, agreed in writing before anything starts. You'll get the number on the call.</dd></div>
  <div><dt>Who it's for</dt><dd>Small service businesses: practices, trades, firms, shops</dd></div>
</dl>
${bookCta}
<p>No generic AI playbook. This is built around your actual business.</p>
<h2>How it works</h2>
<ol class="steps">
  <li><span class="num">01</span><h3>We get inside the business</h3><p>We walk through the real operation. Leads, email, follow-up, handoffs, repeated work, bottlenecks, and the things that still depend on someone remembering.</p></li>
  <li><span class="num">02</span><h3>We do the analysis</h3><p>We break down what you showed us, identify the real friction, and determine what actually deserves AI, automation, an agent, or nothing at all.</p></li>
</ol>
<h2>What you get</h2>
${deliverablesHtml}
${bookCta}`,
    schema: () => [assessmentService],
    markdown: `# What actually is an AI Assessment?

We spend 90 minutes learning how your business actually works, then show you where AI belongs, where it doesn't, and what to do first.

- **Your time:** a 90-minute session, then the review call
- **Turnaround:** review call within five business days
- **Price:** a fixed fee, agreed in writing before anything starts; you get the number on the free call
- **Who it's for:** small service businesses (practices, trades, firms, shops)

## How it works
1. **We get inside the business.** We walk through the real operation. Leads, email, follow-up, handoffs, repeated work, bottlenecks, and the things that still depend on someone remembering.
2. **We do the analysis.** We break down what you showed us, identify the real friction, and determine what actually deserves AI, automation, an agent, or nothing at all.

## What you get
${deliverables.map(([t, d]) => `- **${t}:** ${d}`).join('\n')}

Start with the free 15-minute fit call: ${SITE.bookingUrl}`,
  },

  {
    path: '/work/',
    title: 'Work · Real AI builds for small businesses · Aidvance',
    description:
      'Examples of what an Aidvance engagement can lead to, starting with Morning Desk: a sales dashboard built on a salesperson\'s email inbox.',
    h1: 'Work',
    crumb: 'Work',
    updated: UPDATED,
    body: `
<p class="label">Work</p>
<h1>Work</h1>
<p class="lede">What it looks like when the assessment finds something worth building.</p>
<article class="card">
  <h2><a href="/work/morning-desk/">Morning Desk</a></h2>
  <p>Have your inbox work for you. A sales dashboard built for a salesperson at a Manhattan wholesale company, on top of the email inbox he already lived in.</p>
  <p><a href="/work/morning-desk/">Explore the demo →</a></p>
</article>
${bookCta}`,
    schema: () => [],
    markdown: `# Work

## Morning Desk
Have your inbox work for you. A sales dashboard built for a salesperson at a Manhattan wholesale company, on top of the email inbox he already lived in. Demo: ${SITE.origin}/work/morning-desk/`,
  },

  {
    path: '/work/morning-desk/',
    title: 'Morning Desk · A sales dashboard built on your inbox · Aidvance',
    description:
      'Morning Desk is a sales dashboard Aidvance built on top of an email inbox, so a salesperson starts the day with the inbox already sorted into work. Sample-data demo.',
    h1: 'Morning Desk',
    crumb: 'Morning Desk',
    parent: { path: '/work/', crumb: 'Work' },
    updated: UPDATED,
    body: `
<p class="label">Work · Case study</p>
<h1>Morning Desk</h1>
<p class="lede">A sales dashboard built on your email inbox. Have your inbox work for you.</p>
<p>Morning Desk was built for a real client: a salesperson at a Manhattan wholesale company whose day ran through his inbox. Instead of adding another tool, it turns the inbox he already uses into a morning dashboard of the work that needs doing.</p>
<p>The demo below runs on sample data. Click around.</p>
<!-- The interactive Morning Desk demo mounts here. -->
<div id="morning-desk-demo" class="demo-mount" data-demo-mount>
  <p class="fine">The interactive demo needs JavaScript.</p>
</div>
${bookCta}`,
    schema: () => [
      {
        '@type': 'CreativeWork',
        name: 'Morning Desk',
        description: 'A sales dashboard built on top of an email inbox for a salesperson at a Manhattan wholesale company.',
        creator: { '@id': `${SITE.origin}/#org` },
      },
    ],
    markdown: `# Morning Desk

A sales dashboard built on your email inbox. Built for a real client: a salesperson at a Manhattan wholesale company whose day ran through his inbox. Instead of adding another tool, it turns the inbox he already uses into a morning dashboard of the work that needs doing. A sample-data demo is on the page.`,
  },

  {
    path: '/about/',
    title: 'About Aidvance · One person, no software to sell you',
    description:
      'Aidvance Consultancy is run by David Choukroun in Brooklyn, NY. Almost a decade selling to small service businesses; now independent AI advice with no software to sell.',
    h1: 'One person. No software to sell you.',
    crumb: 'About',
    updated: UPDATED,
    body: `
<p class="label">About</p>
<h1>One person. No software to sell you.</h1>
<p class="lede">Aidvance Consultancy helps small business owners figure out where AI actually saves them time or money, and where it doesn't. Before you spend a dollar on a tool.</p>

<h2>Who it's for</h2>
<p>Owners of small service businesses (practices, trades, firms, shops) who are doing real work, feel stretched, and keep hearing they "should be using AI" without anyone telling them where.</p>

<h2>It starts with where you want to go</h2>
<p>Before we talk about AI, we talk about you.</p>
<p><strong>Where are you now?</strong> How the work actually moves through your week.</p>
<p><strong>Where do you want to be?</strong> More customers. Fewer hours. A real vacation with your family. Lower overhead. Whatever matters most to you.</p>
<p><strong>What's in the way?</strong> The calls that don't get returned, the paperwork that eats your nights, the jobs that fall through the cracks.</p>
<p>Then we look at whether AI can close that gap, and exactly where.</p>

<h2 id="david">Who's behind it</h2>
<p>Aidvance Consultancy is run by <strong>David Choukroun</strong>, based in Brooklyn, New York.</p>
<p>${SITE.founder.bio} He knows what a small business week actually looks like, because he spent years inside it with them.</p>
<p>That's still the job. Aidvance Consultancy isn't a software company. The advice is the product.</p>
<p>Find David on <a href="https://x.com/DCBK2LA" rel="me">X (@DCBK2LA)</a> and <a href="https://www.linkedin.com/in/davidchoukroun" rel="me">LinkedIn</a>, or email <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>

<h2>How it works</h2>
${stepsHtml}

<h2 id="faq">Questions</h2>
${faqHtml}
${bookCta}`,
    schema: () => [
      {
        '@type': 'AboutPage',
        '@id': `${SITE.origin}/about/#webpage`,
        url: `${SITE.origin}/about/`,
        about: { '@id': `${SITE.origin}/#org` },
        mainEntity: { '@id': `${SITE.origin}/#david` },
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE.origin}/about/#faq`,
        mainEntity: FAQ.flatMap((g) =>
          g.items.map((i) => ({
            '@type': 'Question',
            name: i.q,
            acceptedAnswer: { '@type': 'Answer', text: i.a },
          }))
        ),
      },
    ],
    markdown: `# About Aidvance: One person. No software to sell you.

${SITE.summary}

## Who's behind it
Aidvance Consultancy is run by David Choukroun, based in Brooklyn, New York. ${SITE.founder.bio} Aidvance Consultancy isn't a software company. The advice is the product. X: https://x.com/DCBK2LA · LinkedIn: https://www.linkedin.com/in/davidchoukroun · Email: ${SITE.email}

## Questions
${FAQ.map((g) => `### ${g.group}\n${g.items.map((i) => `**${i.q}**\n${i.a}`).join('\n\n')}`).join('\n\n')}`,
  },

  {
    path: '/guides/should-my-small-business-use-ai/',
    title: 'Should my small business use AI? A plain-English answer · Aidvance',
    description:
      'A plain-English answer for small service business owners: when AI is worth it, when it is not, and how to find out before you buy a tool.',
    h1: 'Should my small business use AI?',
    crumb: 'Should my small business use AI?',
    updated: UPDATED,
    body: `
<p class="label">Guide · By David Choukroun</p>
<h1>Should my small business use AI?</h1>
<p class="lede"><strong>Short answer:</strong> maybe, but only for the specific jobs where it saves more time or money than it costs to set up. For most small service businesses that's a handful of tasks, not the whole operation. Sometimes the honest answer is that the real fix is a process nobody owns or software you already pay for.</p>

<h2>Start with the job, not the tool</h2>
<p>Most AI tools that don't stick were aimed at the wrong job. Before choosing anything, look at how the work actually moves through your week: the leads, the inbox, the follow-up, the handoffs, and the things that still depend on someone remembering.</p>

<h2>Signs AI could help</h2>
<ul>
  <li>Calls or messages that don't get returned fast enough.</li>
  <li>Paperwork and admin that eats your nights.</li>
  <li>Jobs and follow-ups that fall through the cracks.</li>
  <li>The same task done by hand, the same way, many times a week.</li>
</ul>

<h2>Signs it probably won't</h2>
<ul>
  <li>The problem is that nobody owns the process. A tool won't fix that.</li>
  <li>You already pay for software that does it and nobody set it up.</li>
  <li>The task needs judgment and a personal touch that your customers pay you for.</li>
</ul>

<h2>Can't I just ask ChatGPT?</h2>
<p>You can, and for some things you should. The hard part isn't the tool. It's knowing which of the fifty things in your week are worth handing to it, and which ones will create more work than they save.</p>

<h2>How to find out for your business</h2>
<p>Aidvance's <a href="/ai-assessment/">AI Assessment</a> is a 90-minute session on how your business actually runs, followed within five business days by a review call with a plan: what to fix first, what to leave alone, and what isn't worth automating. It starts with a free 15-minute call. If there's nothing worth assessing, you'll know quickly.</p>
${bookCta}`,
    schema: (p) => [
      {
        '@type': 'Article',
        headline: 'Should my small business use AI?',
        description: p.description,
        author: { '@id': `${SITE.origin}/#david` },
        publisher: { '@id': `${SITE.origin}/#org` },
        datePublished: UPDATED,
        dateModified: UPDATED,
        mainEntityOfPage: `${SITE.origin}${p.path}`,
      },
    ],
    markdown: `# Should my small business use AI?

**Short answer:** maybe, but only for the specific jobs where it saves more time or money than it costs to set up. For most small service businesses that's a handful of tasks, not the whole operation. Sometimes the honest answer is that the real fix is a process nobody owns or software you already pay for.

Signs AI could help: calls or messages that don't get returned fast enough; paperwork that eats your nights; jobs and follow-ups that fall through the cracks; the same task done by hand many times a week.

Signs it probably won't: nobody owns the process; you already pay for software that does it; the task needs judgment and a personal touch customers pay for.

To find out for your business, Aidvance's AI Assessment is a 90-minute session followed within five business days by a review call with a plan. It starts with a free 15-minute call: ${SITE.bookingUrl}`,
  },

  {
    path: '/data-value/',
    title: 'What could your business data be worth? · Data value estimator · Aidvance',
    description:
      'A free seven-step estimator that gives a rough range for what AI companies pay for business data like yours. Your website is optional.',
    h1: 'What could your business data be worth?',
    crumb: 'Data value',
    updated: UPDATED,
    body: `
<p class="label">Data value estimate</p>
<h1>What could your business data be worth?</h1>
<p class="lede">A few quick taps and you'll get a rough range for what AI companies pay for data like yours. Your website is optional and only gives us context.</p>
<p>The estimator takes seven short steps. It's a rough range, not an offer.</p>
<!-- The interactive Data Value estimator mounts here. -->
<div id="data-value-app" class="demo-mount" data-estimator-mount>
  <p class="fine">The estimator needs JavaScript.</p>
</div>
${bookCta}`,
    schema: () => [],
    markdown: `# What could your business data be worth?

A free seven-step estimator on the Aidvance site that gives a rough range for what AI companies pay for business data like yours. Your website is optional and only gives context. It's a rough range, not an offer.`,
  },
];
