// Case studies and industry pages. Kept apart from pages.mjs because they are
// data-shaped: each entry becomes a page, a FAQ block and an llms.txt line.
//
// Case studies follow the house case-study rules: no client names, roles not
// people, only numbers the client gave, at least one "leave it alone"
// recommendation, and no outcome the client didn't state.

import { SITE } from './site.mjs';

const UPDATED = '2026-10-25';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const list = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
const mdList = (items) => items.map((i) => `- ${i.replace(/<[^>]+>/g, '')}`).join('\n');

const bookCta = `
<div class="cta-row">
  <a class="btn btn-primary" href="${SITE.bookingUrl}">Book a free 15-minute call with Dave</a>
  <a class="btn btn-secondary" href="/#casey">Talk to Casey</a>
</div>
<p class="fine">Start with the free 15-minute fit call. If there is nothing worth assessing, we'll know quickly.</p>`;

const faqHtml = (faqs) =>
  `<div class="faq">${faqs.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</div>`;

const faqSchema = (path, faqs) => ({
  '@type': 'FAQPage',
  '@id': `${SITE.origin}${path}#faq`,
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

// ---------------------------------------------------------------- case studies

export const CASES = [
  {
    slug: 'freight-brokerage',
    title: 'A freight brokerage where the chasing, not the typing, was the problem',
    short: 'A small food-freight brokerage thought re-keying was its problem. Its own numbers said appointment and status chasing cost far more, and the fixes ran on software it already paid for.',
    industry: 'freight-logistics',
    business:
      "A small freight brokerage with no trucks of its own, moving mostly less-than-truckload freight, much of it food. Two desks handle quoting, booking carriers, appointments, tracking and a daily status report to the main customers. It runs on Gmail and Google Workspace, a load board, its own rate-confirmation system and one large shared spreadsheet. Customers stay because they always know where their freight is, not because it's the cheapest.",
    numbers: [
      'About <strong>10 hours a week</strong> across both desks spent making and chasing appointments.',
      'About <strong>100 emails a week</strong> chasing status on loads already moving.',
      'About <strong>2 minutes</strong> to enter one load into their system.',
    ],
    found: [
      "<strong>Appointments were the leak, and nothing flagged them.</strong> The trigger was a blank cell in the spreadsheet, spotted by eye. The desks deliberately book appointments for smaller carriers to keep control, which is the right call; done entirely by hand, that control cost about ten hours a week.",
      "<strong>Status chasing was a trap in both directions.</strong> Ask too little and the customer calls first about a missed pickup. Ask too much and everyone gets annoyed. More or less chasing wasn't the answer. Cheaper chasing was.",
      "<strong>They were already paying for part of the fix.</strong> A carrier-vetting service on their bill included truck tracking alerts that had never made it into the daily routine. It was one of four tools that had been bought or built, worked, and quietly stopped being used. The real constraint was adoption, not capability.",
    ],
    recommended: {
      a: [
        'A small script on the spreadsheet they already keep that emails the desks, twice a day, every upcoming pickup with no appointment yet. Cost: nothing beyond the Google Workspace they pay for.',
        'Put the tracking they already pay for into the daily routine, with one named owner for the alerts, and ask each regular carrier what automatic status updates they can send.',
        'Five written one-page procedures for how the work actually runs today, so it survives a desk being empty. Delivered with the assessment.',
      ],
      skill: [
        'Later: move the owner\'s own quote-drafting assistant, which drafts replies for approval and never sends, from a personal login onto a shared business account.',
        'Later: a daily draft of the customer status report for the desk to review and send. Never auto-send.',
      ],
      eng: ['Down the road, and not ours to build: notification hooks on their own system, so alerts come from the record instead of a spreadsheet.'],
      c: [
        "<strong>Don't pay anyone to integrate the system for automatic load entry.</strong> Their developer offered full access to build it. We recommended against it: the typing it replaces costs an hour or two a week, there is no proper API to build on, and only one person knows the system.",
        "Don't buy a second tracking product, don't build a driver check-in app, and don't automate the customer relationship itself. The daily personal contact is the product.",
      ],
    },
    chose: '[DAVE TO CONFIRM: which recommendations the client took, deferred or declined, and why.]',
    happened: 'Too early to say.',
    differently:
      "I walked out of the discovery call sure the headline was re-keying: the same load details typed four or five times a day. Then the client's own numbers came back. Two minutes a load is an hour or two a week; appointments alone were ten. Chasing outweighed typing by roughly six to one, and I rebuilt the roadmap around it. Next time I ask for the numbers before I settle on a headline.",
  },
  {
    slug: 'morning-desk',
    title: 'Morning Desk: a sales dashboard for a consumer-products company',
    short: "A New York company that designs, licenses, makes and distributes branded products. For one salesperson whose day ran through his inbox, we built Morning Desk: the inbox, sorted into the day's work.",
    industry: 'wholesale-consumer-products',
    business:
      "A long-established New York company that designs, licenses, manufactures and distributes branded consumer products across many categories, selling to retailers from dollar stores to department stores. A salesperson's day runs through his email: buyer questions, orders, follow-ups and approvals, all mixed together in one inbox.",
    numbers: [],
    found: [
      '<strong>The inbox was the to-do list, and it didn\'t sort itself.</strong> The work that mattered each morning was buried among everything else that arrived overnight.',
      "<strong>Security came first.</strong> A company that handles licensed brands for major retailers can't hand an AI tool the keys to its systems on day one.",
    ],
    recommended: {
      a: ['Start with documents only: a few files someone chooses, with nothing connected to company systems.'],
      skill: [
        "<strong>Morning Desk</strong>: a dashboard built on top of the salesperson's existing inbox, so the day starts with the work already sorted. No new system for him to learn.",
      ],
      eng: ['Connections to company systems only after IT signs off, read-only first, and with a person approving every action.'],
      c: ["Don't connect AI to company systems before IT has signed off, however useful it looks. Earn access one step at a time."],
    },
    chose: '[DAVE TO CONFIRM: whether Morning Desk is in daily use, and anything the client declined or deferred.]',
    happened: 'Too early to say.',
    differently: '[DAVE TO WRITE: one thing you would do differently on this engagement.]',
    demo: true,
  },
];

export const casePath = (c) => `/work/${c.slug}/`;

function casePage(c) {
  const path = casePath(c);
  const r = c.recommended;
  const tiers = [
    ['Your own team can do it now', r.a],
    ['A Claude skill or assistant on a standard setup', r.skill],
    ['Needs a developer (we refer this out)', r.eng],
    ['Leave it alone', r.c],
  ].filter(([, items]) => items.length);

  const body = `
<p class="label">Work · Case study</p>
<h1>${c.title}</h1>
<p class="lede">${c.short}</p>
<p class="fine">Client not named. Every number below came from the client.</p>

<h2>The business</h2>
<p>${c.business}</p>
${c.numbers.length ? `<h2>Their numbers</h2>${list(c.numbers)}` : ''}

<h2>What we found</h2>
${list(c.found)}

<h2>What we recommended</h2>
${tiers.map(([label, items]) => `<h3>${label}</h3>${list(items)}`).join('')}

<h2>What they chose to do</h2>
<p>${c.chose}</p>

<h2>What happened</h2>
<p>${c.happened}</p>

<h2>What I'd do differently</h2>
<p>${c.differently}</p>
${c.demo ? `<h2>Try the demo</h2>
<p>The demo below runs on sample data. Click around.</p>
<!-- The interactive Morning Desk demo mounts here. -->
<div id="morning-desk-demo" class="demo-mount" data-demo-mount>
  <p class="fine">The interactive demo needs JavaScript.</p>
</div>` : ''}
${bookCta}`;

  return {
    path,
    title: `${c.title} · Aidvance case study`,
    description: c.short,
    h1: c.title,
    crumb: c.slug === 'morning-desk' ? 'Morning Desk' : 'Freight brokerage',
    parent: { path: '/work/', crumb: 'Work' },
    updated: UPDATED,
    body,
    schema: (p) => [
      {
        '@type': 'Article',
        headline: c.title,
        description: c.short,
        author: { '@id': `${SITE.origin}/#david` },
        publisher: { '@id': `${SITE.origin}/#org` },
        datePublished: UPDATED,
        dateModified: UPDATED,
        mainEntityOfPage: `${SITE.origin}${p.path}`,
      },
    ],
    markdown: `# ${c.title}

${c.short}

Client not named. Every number came from the client.

## The business
${c.business}
${c.numbers.length ? `\n## Their numbers\n${mdList(c.numbers)}\n` : ''}
## What we found
${mdList(c.found)}

## What we recommended
${tiers.map(([label, items]) => `### ${label}\n${mdList(items)}`).join('\n\n')}

## What they chose to do
${c.chose}

## What happened
${c.happened}

## What I'd do differently
${c.differently}`,
  };
}

// ------------------------------------------------------------ industry pages
//
// Written as "where we look" rather than claims about results: no statistics,
// no promised savings. Each page answers the question an owner would type
// into an AI assistant, in plain words, then hands off to the free call.

export const INDUSTRIES = [
  {
    slug: 'dental-chiropractic-physical-therapy',
    name: 'Dental, chiropractic and physical therapy practices',
    short: 'Dental, chiro and PT',
    question: 'Should my dental, chiropractic or physical therapy practice use AI?',
    answer:
      "Probably for a few front-desk jobs, and probably not for anything clinical. Most practices lose time on the phone, on reminders and rescheduling, on insurance paperwork and on getting patients to come back. Those are the places worth checking first. The answer depends on what your practice software already does, because a lot of practices pay for features nobody switched on.",
    look: [
      'Calls that go to voicemail during busy hours, and whether anyone calls back.',
      'Appointment reminders, confirmations and rescheduling, done by hand.',
      'Recall and reactivation: patients who are due back but never get the nudge.',
      'Insurance verification and the paperwork before and after a visit.',
      'Features in your practice-management software that you pay for and never set up.',
    ],
    leave: [
      'Anything that makes a clinical decision or replaces your judgment.',
      'Replacing a front desk that patients like with a phone robot they hate.',
    ],
    faqs: [
      { q: 'Is AI safe to use with patient information?', a: 'Only with tools and settings built for it, and only where you understand what data goes where. Part of the assessment is telling you which jobs can be done without touching patient records at all.' },
      { q: 'Will AI replace my front desk?', a: "That's your call. For most practices the useful version takes repetitive work off a stretched front desk so they can spend more time with the patients in front of them." },
      { q: 'Do I need new software?', a: "Often not. Many practices already pay for reminder, recall or online-booking features that were never turned on. We check what you have before suggesting anything new." },
    ],
  },
  {
    slug: 'med-spas',
    name: 'Med spas and aesthetics clinics',
    short: 'Med spas',
    question: 'How can a med spa use AI?',
    answer:
      "Mostly in the gaps between a person asking and a person booking. Med spas tend to lose clients in slow replies to inquiries, missed calls, follow-up after consultations and rebooking after a treatment. Those are worth checking before anything flashy. Some of it your booking software may already do.",
    look: [
      'How fast new inquiries from your website, Instagram and phone get a real answer.',
      "Consultations that don't turn into a booked treatment, and whether anyone follows up.",
      'Rebooking reminders timed to each treatment.',
      'Reviews and before-and-after requests that depend on someone remembering.',
      "Features in your booking platform you're paying for but not using.",
    ],
    leave: [
      'Medical advice or treatment recommendations from a chatbot.',
      'Automated messages that make a personal, high-trust service feel like a vending machine.',
    ],
    faqs: [
      { q: 'Can AI answer client questions for my med spa?', a: "It can handle the routine ones, like hours, pricing ranges, booking and prep instructions, if it's set up carefully and hands anything medical to a person. We look at whether that's worth it for your volume." },
      { q: 'What should a med spa automate first?', a: 'Usually the follow-up nobody has time for: inquiries, post-consultation follow-up and rebooking. But it depends on where your clients actually drop off, which is what the assessment finds.' },
      { q: 'Will it sound robotic to my clients?', a: 'It can, which is why we start with drafts and reminders a person reviews, not a bot talking to clients on its own.' },
    ],
  },
  {
    slug: 'home-services',
    name: 'Home-service trades: HVAC, plumbing, electrical, contractors',
    short: 'Home-service trades',
    question: 'Should my home-service business use AI?',
    answer:
      "For a few office jobs, yes; for the work in the field, mostly no. Trades businesses usually lose money on missed calls while everyone is on a job, slow quotes, scheduling and dispatch juggling, and invoices that sit unpaid. Those are the places to check. Your field-service software may already handle more than you're using it for.",
    look: [
      'Calls missed while the team is on a job, and how many turn into lost work.',
      'How long it takes to get a quote or estimate out after a visit.',
      'Scheduling and dispatch done by phone and text.',
      'Invoices and payment follow-up that wait until someone has time.',
      'Reviews and repeat-service reminders, like annual maintenance.',
    ],
    leave: [
      "Pricing a job with AI that hasn't seen the site.",
      "Adding an app your crew won't open in the field.",
    ],
    faqs: [
      { q: 'Can AI answer my phones when I am on a job?', a: "It can take the call, collect the details and book or flag it, which beats voicemail. Whether it's worth it depends on how many calls you actually miss, so we measure that first." },
      { q: 'Do I need to change my scheduling software?', a: 'Usually not. Most of the useful changes sit on top of what you already use.' },
      { q: 'What does an AI assessment cost for a contractor?', a: "A fixed fee, agreed in writing before anything starts. You'll get the number on the free call." },
    ],
  },
  {
    slug: 'accounting-and-law-firms',
    name: 'Accounting firms and law firms',
    short: 'Accounting and law',
    question: 'How should a small accounting or law firm use AI?',
    answer:
      "Carefully, and mostly for first drafts and the admin around client work, not for the judgment clients pay for. Small firms tend to lose time on intake and engagement letters, chasing clients for documents, scheduling, and summarizing long material. Confidentiality decides which tools are even allowed, so that comes first.",
    look: [
      'New-client intake and engagement letters, done by hand each time.',
      'Chasing clients for documents and signatures.',
      'Scheduling and the email back-and-forth around meetings.',
      'First drafts and summaries of long documents, always reviewed by a professional.',
      'Templates and knowledge that live in one person\'s head.',
    ],
    leave: [
      "Advice to clients that no professional has reviewed.",
      'Putting confidential client material into consumer AI tools.',
    ],
    faqs: [
      { q: 'Is it safe to use AI with confidential client files?', a: 'Only with business-tier tools that do not train on your data, under settings you understand. We tell you which jobs can be done safely and which should stay manual.' },
      { q: 'Will AI replace associates or staff accountants?', a: "That's your decision. Most small firms use it to take routine drafting and admin off people so they can do more of the work clients value." },
      { q: 'Where should a small firm start?', a: 'Usually intake and document chasing. They are repetitive, they annoy clients, and they do not require AI to make any judgment.' },
    ],
  },
  {
    slug: 'freight-logistics',
    name: 'Freight brokerage and logistics',
    short: 'Freight and logistics',
    question: 'How can a small freight brokerage use AI?',
    answer:
      "Mostly to make the chasing cheaper. In one brokerage we assessed, appointments took about ten hours a week and status emails about a hundred, while typing a load into the system took two minutes. The best fixes ran on tools they already paid for. Integrating systems was the expensive idea we recommended against.",
    look: [
      'Appointment booking and confirmation, and what triggers it.',
      'Status emails and calls on loads already moving.',
      'Tracking features already included in tools on your bill.',
      'The daily customer status report and how long it takes to build.',
      'Receivables follow-up and how long invoices sit.',
    ],
    leave: [
      "Paying for a system integration before you know what the typing actually costs.",
      'Automating the customer relationship that keeps you from being the cheapest option.',
    ],
    faqs: [
      { q: 'Should a small brokerage buy a TMS or integrate its systems?', a: 'Not before you have measured where the hours go. In our freight case study, the integration a developer offered would have saved an hour or two a week; appointment chasing cost ten.' },
      { q: 'What can AI do on LTL freight?', a: 'Less than on full truckloads, because there is no single truck to track. The practical step is asking each regular carrier what automatic status they can send.' },
      { q: 'Is there a real example?', a: 'Yes. Our freight brokerage case study shows what we found, what we recommended, and what we told them to leave alone.' },
    ],
  },
  {
    slug: 'wholesale-consumer-products',
    name: 'Wholesale, licensing and consumer-products companies',
    short: 'Wholesale and consumer products',
    question: 'How can a wholesale or consumer-products company use AI safely?',
    answer:
      "Start with documents and drafts, and earn access to your systems one step at a time. Companies that design, license and sell to retailers spend a lot of time on license terms, retailer rules, order follow-up and sales email. AI can help with all of it, but only after you've decided what it's allowed to touch.",
    look: [
      'Answering questions from license agreements and retailer vendor manuals.',
      'Orders likely to miss their ship date, flagged early.',
      "A salesperson's inbox, sorted into the day's work.",
      'Line sheets, pitch materials and product listings drafted to each brand\'s rules.',
    ],
    leave: [
      'Connecting AI to company systems before IT signs off.',
      'Letting an assistant take actions without a person approving them.',
    ],
    faqs: [
      { q: 'Will AI tools train on our company data?', a: "Business plans from the major providers don't use your prompts or company data to train their models by default. Check the current terms for the tool you pick." },
      { q: 'How do we start without risking our systems?', a: 'In three steps: documents only, then one read-only report, then limited connections after IT signs off, with a person approving every action.' },
      { q: 'Is there a real example?', a: "Yes. Morning Desk is a sales dashboard we built for a consumer-products company, on top of a salesperson's existing inbox." },
    ],
  },
];

export const industryPath = (i) => `/industries/${i.slug}/`;

function industryPage(i) {
  const path = industryPath(i);
  const cases = CASES.filter((c) => c.industry === i.slug);
  const body = `
<p class="label">Who we help · ${i.short}</p>
<h1>${i.question}</h1>
<p class="lede"><strong>Short answer:</strong> ${i.answer}</p>

<h2>Where we look first</h2>
${list(i.look)}

<h2>What we'd usually leave alone</h2>
${list(i.leave)}

${cases.length ? `<h2>Real example</h2>${cases.map((c) => `<article class="card"><h3><a href="${casePath(c)}">${c.title}</a></h3><p>${c.short}</p></article>`).join('')}` : ''}

<h2>How to find out for your business</h2>
<p>The <a href="/ai-assessment/">AI Assessment</a> is a 90-minute session on how your business actually runs, followed within five business days by a review call with a plan: what to fix first, what to leave alone, and what isn't worth automating. It starts with a free 15-minute call.</p>

<h2>Questions</h2>
${faqHtml(i.faqs)}
${bookCta}`;

  return {
    path,
    title: `${i.question} · Aidvance`,
    description: i.answer.split('. ').slice(0, 2).join('. ').replace(/\.?$/, '.'),
    h1: i.question,
    crumb: i.short,
    parent: { path: '/industries/', crumb: 'Who we help' },
    updated: UPDATED,
    body,
    schema: (p) => [faqSchema(p.path, i.faqs)],
    markdown: `# ${i.question}

**Short answer:** ${i.answer}

## Where we look first
${mdList(i.look)}

## What we'd usually leave alone
${mdList(i.leave)}

## Questions
${i.faqs.map((f) => `**${f.q}**\n${f.a}`).join('\n\n')}`,
  };
}

// ------------------------------------------------------------ index pages

const workPage = {
  path: '/work/',
  title: 'Work · Real AI assessments and builds · Aidvance',
  description:
    'Case studies from Aidvance engagements, with clients unnamed: what we found, what we recommended, and what we told them to leave alone.',
  h1: 'Work',
  crumb: 'Work',
  updated: UPDATED,
  body: `
<p class="label">Work</p>
<h1>Work</h1>
<p class="lede">What we found, what we recommended, and what we told clients to leave alone. Clients aren't named, and every number came from them.</p>
<ul class="cards">${CASES.map((c) => `<li class="card"><h2><a href="${casePath(c)}">${c.title}</a></h2><p>${c.short}</p></li>`).join('')}</ul>
${bookCta}`,
  schema: () => [],
  markdown: `# Work

Case studies with clients unnamed.

${CASES.map((c) => `- [${c.title}](${SITE.origin}${casePath(c)}): ${c.short}`).join('\n')}`,
};

const industriesPage = {
  path: '/industries/',
  title: 'Who we help · AI advice by industry · Aidvance',
  description:
    'Plain-English answers on where AI helps, and where it does not, for practices, med spas, trades, firms, freight brokerages and consumer-products companies.',
  h1: 'Who we help',
  crumb: 'Who we help',
  updated: UPDATED,
  body: `
<p class="label">Who we help</p>
<h1>Who we help</h1>
<p class="lede">Owners of small service businesses who keep hearing they should be using AI, without anyone telling them where. Pick yours for a straight answer.</p>
<ul class="cards">${INDUSTRIES.map((i) => `<li class="card"><h2><a href="${industryPath(i)}">${i.name}</a></h2><p>${i.question}</p></li>`).join('')}</ul>
<p>Don't see yours? The <a href="${SITE.bookingUrl}">free 15-minute call</a> is how to find out.</p>`,
  schema: () => [],
  markdown: `# Who we help

${INDUSTRIES.map((i) => `- [${i.question}](${SITE.origin}${industryPath(i)})`).join('\n')}`,
};

export const CONTENT_PAGES = [workPage, ...CASES.map(casePage), industriesPage, ...INDUSTRIES.map(industryPage)];
