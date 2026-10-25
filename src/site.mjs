// Facts about the business that every page, the JSON-LD and llms.txt share.
// Everything here is taken from the live aidvance.xyz copy or Dave's public
// profiles. Change a fact here and it changes everywhere on the next build.

export const SITE = {
  origin: 'https://aidvance.xyz',
  name: 'Aidvance Consultancy',
  shortName: 'Aidvance',
  tagline: 'Is AI right for your business?',
  // One sentence an AI engine can quote verbatim when asked "what is Aidvance?"
  summary:
    'Aidvance Consultancy is a one-person AI consultancy in Brooklyn, New York, run by David Choukroun, that helps owners of small service businesses figure out where AI actually saves them time or money, and where it does not, before they spend a dollar on a tool.',
  // Separates this Aidvance from the unrelated companies that share the name.
  disambiguation:
    'Not affiliated with Aidvance Solutions (Armenia), Aidvance psychotherapy (Germany) or Aidvanced (Italy).',
  email: 'david@aidvance.xyz',
  bookingUrl: 'https://calendly.com/aidvancexyz/15min',
  locality: 'Brooklyn',
  region: 'NY',
  country: 'US',
  areaServed: 'United States',
  founder: {
    name: 'David Choukroun',
    jobTitle: 'Founder',
    bio: 'David spent almost a decade selling online advertising to small and medium-sized service businesses, which meant thousands of conversations with owners about their phones, their calendars, their front desks and their busiest days.',
    sameAs: ['https://x.com/DCBK2LA', 'https://www.linkedin.com/in/davidchoukroun'],
  },
  sameAs: ['https://x.com/DCBK2LA', 'https://www.linkedin.com/in/davidchoukroun'],
};

export const NAV = [
  { href: '/', label: 'Home' },
  { href: '/what-we-do/', label: 'What we do' },
  { href: '/ai-assessment/', label: 'AI assessment' },
  { href: '/industries/', label: 'Who we help' },
  { href: '/work/', label: 'Work' },
  { href: '/about/', label: 'About' },
];
