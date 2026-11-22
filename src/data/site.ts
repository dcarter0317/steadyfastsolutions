import electricalPhoto from '../assets/electrical.jpeg'
import hvacPhoto from '../assets/hvac.jpeg'
import plumbingPhoto from '../assets/plumbing.jpeg'
import type { FooterColumnProps, JobCardProps, ServiceCardProps } from '../components'

/**
 * Site content. Anything in [BRACKETS] is a placeholder to replace before launch.
 */
export const site = {
  name: 'Steadfast Solutions',
  descriptor: 'General Contracting & Repairs',
  motto: 'Big or small, we do it all',
  serviceArea: '[SERVICE AREA]',
  license: '[LICENSE #]',
  phone: '[PHONE NUMBER]',
  /** Swap for `tel:+1…` once the real number is in. */
  phoneHref: '#quote',
  email: '[EMAIL]',
  hours: '[HOURS]',
  responseTime: '[RESPONSE TIME]',
}

export const navLinks = [
  { label: 'HVAC', href: '#hvac' },
  { label: 'Electrical', href: '#electrical' },
  { label: 'Plumbing', href: '#plumbing' },
  { label: 'Our work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'FAQ', href: '#faq' },
]

export const symptoms = [
  { label: 'No heat or no A/C', href: '#quote' },
  { label: 'Breaker keeps tripping', href: '#quote' },
  { label: 'Leak or low water pressure', href: '#quote' },
  { label: 'Something else', href: '#quote' },
]

export const services: ServiceCardProps[] = [
  {
    id: 'hvac',
    index: '01',
    category: 'Heating & Cooling',
    icon: 'fa-fan',
    title: 'HVAC',
    description: 'We repair, replace and tune furnaces, heat pumps, central air and ductwork before the season turns.',
    items: ['Furnace & boiler repair', 'A/C & heat pump installs', 'Ductwork & air quality', 'Seasonal tune-ups'],
    href: '#quote',
    linkLabel: 'HVAC services',
  },
  {
    id: 'electrical',
    index: '02',
    category: 'Power & Lighting',
    icon: 'fa-bolt',
    title: 'Electrical',
    description: 'We wire panels, circuits, outlets and lighting to code and label everything, so it’s ready for the inspector.',
    items: ['Panel upgrades & breakers', 'New circuits & EV chargers', 'Lighting & ceiling fans', 'Troubleshooting & repairs'],
    href: '#quote',
    linkLabel: 'Electrical services',
  },
  {
    id: 'plumbing',
    index: '03',
    category: 'Water & Drains',
    icon: 'fa-faucet-drip',
    title: 'Plumbing',
    description: 'We track down leaks, clear clogs, and fix water heaters and fixtures without leaving a wet floor behind.',
    items: ['Leak detection & repair', 'Water heaters (tank & tankless)', 'Drain cleaning & sewer lines', 'Fixtures, sinks & toilets'],
    href: '#quote',
    linkLabel: 'Plumbing services',
  },
]

/** True for values still wrapped in [BRACKETS]. Structured data and llms.txt skip these so no placeholder ever ships as a fact. */
export const isPlaceholder = (value: string) => /\[[^\]]*\]/.test(value)

/** Search-result and social-share copy. Keep the description under ~160 characters. */
export const seo = {
  title: 'Steadfast Solutions | HVAC, Electrical & Plumbing Repairs',
  description:
    'One crew for HVAC, electrical and plumbing repairs. Steadfast Solutions quotes before work starts and cleans up after. Request a free quote.',
}

/** Entity-defining copy for the About section. Written to be quotable on its own. */
export const about = {
  eyebrow: 'About us',
  title: 'One licensed crew for heat, power and water',
  paragraphs: [
    `${site.name} is a general contracting and repair company for homes. We handle HVAC, electrical and plumbing, so one call covers the whole job instead of three contractors and three schedules.`,
    'Every job follows the same promise: we diagnose the problem, give you the price before any work starts, fix it right, and clean up when we’re done.',
  ],
  facts: [
    { term: 'Trades', detail: 'HVAC, electrical and plumbing' },
    { term: 'Service area', detail: site.serviceArea },
    { term: 'Licensing', detail: `${site.license} · Licensed & insured` },
    { term: 'Quotes', detail: 'Free, and given before any work starts' },
  ],
}

/** Plain-language answers, also published as FAQPage structured data. Each answer leads with the direct answer. */
export const faqs = [
  {
    question: 'What services does Steadfast Solutions offer?',
    answer:
      'Steadfast Solutions handles HVAC, electrical and plumbing for homes. That covers furnace and boiler repair, A/C and heat pump installs, ductwork, panel upgrades, new circuits and EV chargers, lighting, leak repair, water heaters, drain cleaning and fixtures.',
  },
  {
    question: 'Can one company handle HVAC, electrical and plumbing on the same job?',
    answer:
      'Yes. One crew covers every trade the job needs, so you’re not waiting on a second contractor. A new furnace needs a circuit and a water heater needs gas, power and pipe, and we handle the whole job.',
  },
  {
    question: 'Will I know the price before the work starts?',
    answer: 'Yes. We diagnose the problem, show it to you and give you the price before any work starts. You decide whether to go ahead.',
  },
  {
    question: 'How do I get a quote?',
    answer: 'Call us or use the free quote form on this page. Tell us what’s wrong and we’ll give you a set arrival window.',
  },
  {
    question: 'Do you offer emergency service?',
    answer:
      'Yes, we offer same-day emergency service. If your furnace is out, a breaker keeps tripping or a pipe is leaking, call us instead of using the form.',
  },
  {
    question: 'Are you licensed and insured?',
    answer: 'Yes. Steadfast Solutions is licensed and insured, and we label our electrical work so it’s ready for the inspector.',
  },
  {
    question: 'Do you clean up after the job?',
    answer: 'Yes. We put down drop cloths and haul out the debris, so your place looks like we were never there.',
  },
]

export const processSteps = [
  { step: 1, title: 'Call or book online', description: 'Tell us what’s wrong and we’ll give you a set arrival window.' },
  { step: 2, title: 'We diagnose & quote', description: 'You see the problem and the price before any work starts. You decide.' },
  { step: 3, title: 'We fix it right', description: 'One crew covers every trade the job needs, so you’re not waiting on a second contractor.' },
  { step: 4, title: 'We clean up', description: 'Drop cloths down, debris hauled out. Your place looks like we were never there.' },
]

export const jobs: JobCardProps[] = [
  { photoUrl: hvacPhoto, alt: 'Outdoor heat pump condenser beside a house', trade: 'HVAC', town: '[TOWN]', title: 'Furnace swap to a ducted heat pump' },
  { photoUrl: electricalPhoto, alt: 'Circuit breaker installed in an electrical panel', trade: 'Electrical', town: '[TOWN]', title: 'Panel upgrade for a new EV charger' },
  { photoUrl: plumbingPhoto, alt: 'Water supply line with meters mounted on a wall', trade: 'Plumbing', town: '[TOWN]', title: 'Water line repair & new shutoffs' },
]

export const tradeOptions = [
  { value: 'hvac', label: 'HVAC' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'unsure', label: 'Not sure' },
]

export const footerColumns: FooterColumnProps[] = [
  {
    title: 'Services',
    links: [
      { label: 'HVAC', href: '#hvac' },
      { label: 'Electrical', href: '#electrical' },
      { label: 'Plumbing', href: '#plumbing' },
      { label: 'General repairs', href: '#quote' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#about' },
      { label: 'Our work', href: '#work' },
      { label: 'Service area', href: '#about' },
    ],
  },
  {
    title: 'Contact',
    links: [{ label: site.phone, href: site.phoneHref, strong: true }, { label: site.email }, { label: site.hours }],
  },
]
