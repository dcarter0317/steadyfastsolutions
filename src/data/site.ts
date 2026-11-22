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
