/**
 * Specimen registry — everything the styleguide can show.
 *
 * Each specimen is one page in the sidebar. Component and layout specimens are
 * built from `variants`; each variant renders live and gets a code snippet
 * generated from the same props (`toJsx`), so docs can't drift from the render.
 * Foundations render a custom `content` node instead.
 *
 * To document a new pattern: build it in src/components or src/layout, then
 * add one entry to `specimens` below.
 */
import { createElement, isValidElement } from 'react'
import type { ComponentType, ReactElement, ReactNode } from 'react'
import {
  Button,
  Checklist,
  Chip,
  ChipRow,
  Eyebrow,
  FooterColumn,
  HouseDiagram,
  JobCard,
  Logo,
  ProcessStep,
  QuoteCard,
  RadioPills,
  SectionHeading,
  ServiceCard,
  Tag,
  TextArea,
  TextField,
  TextLink,
} from '../src/components'
import {
  Container,
  Footer,
  Header,
  Hero,
  HomePage,
  Layout,
  ProcessSection,
  QuoteForm,
  QuoteSection,
  Section,
  ServicesSection,
  Topbar,
  WorkSection,
} from '../src/layout'
import { ColorsSpecimen, IconsSpecimen, MotionSpecimen, SpacingSpecimen, TypographySpecimen } from './foundations'
import { footerColumns, jobs, processSteps, services, site, symptoms, tradeOptions } from '../src/data/site'

/* ────────────────────────────────────────────────────────────────
 * Types
 * ──────────────────────────────────────────────────────────────── */

export type GroupId = 'foundations' | 'components' | 'layout' | 'pages'

export type Surface = 'dark' | 'sand' | 'light'

export type Variant = {
  id: string
  name: string
  note?: string
  element: ReactNode
  /** Snippet shown under the preview. */
  code: string
  /** Background the variant is designed for. The toolbar can override it. */
  surface?: Surface
  /** Cap the preview width, e.g. for cards that would otherwise stretch. */
  maxWidth?: string
}

export type PropDoc = {
  name: string
  type: string
  default?: string
  description: string
  required?: boolean
}

export type Specimen = {
  id: string
  group: GroupId
  title: string
  summary: string
  status?: 'stable' | 'draft'
  /** File the pattern lives in. */
  source?: string
  variants?: Variant[]
  /** Full-bleed variants (layout templates) skip the preview padding. */
  bleed?: boolean
  props?: PropDoc[]
  /** Custom body for foundations. */
  content?: ReactNode
  /** Short usage guidance shown above the variants. */
  guidance?: string[]
}

export const groups: Array<{ id: GroupId; label: string; description: string; maps: string }> = [
  {
    id: 'foundations',
    label: 'Foundations',
    description: 'Colour, type, spacing and motion — the tokens every pattern is built from.',
    maps: 'styleguide/css/theme.css + tokens.css',
  },
  {
    id: 'components',
    label: 'Components',
    description: 'Atoms and molecules: buttons, cards, form fields. Small, reusable, content-agnostic.',
    maps: 'src/components',
  },
  {
    id: 'layout',
    label: 'Layout',
    description: 'Organisms and templates: the page shell and each full-width section.',
    maps: 'src/layout',
  },
  {
    id: 'pages',
    label: 'Pages',
    description: 'Complete pages composed from layout templates with real content.',
    maps: 'src/layout/HomePage.tsx',
  },
]

/* ────────────────────────────────────────────────────────────────
 * JSX serializer — turns (name, props, children) into a code snippet
 * ──────────────────────────────────────────────────────────────── */

const INDENT = '  '

function elementName(el: ReactElement): string {
  const type = el.type as unknown
  if (typeof type === 'string') return type
  if (typeof type === 'function') {
    const fn = type as { displayName?: string; name?: string }
    return fn.displayName || fn.name || 'Component'
  }
  return 'Fragment'
}

function elementToJsx(el: ReactElement, depth: number): string {
  const { children, ...rest } = el.props as Record<string, unknown>
  return toJsx(elementName(el), rest, children as ReactNode, depth)
}

function literal(value: unknown, depth: number): string {
  if (isValidElement(value)) return elementToJsx(value, depth)
  if (typeof value === 'string') return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
  if (typeof value === 'function') return '() => {}'
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    const items = value.map((item) => literal(item, depth + 1))
    const flat = `[${items.join(', ')}]`
    if (flat.length <= 56 && !flat.includes('\n')) return flat
    const pad = INDENT.repeat(depth + 1)
    return `[\n${items.map((item) => pad + item).join(',\n')},\n${INDENT.repeat(depth)}]`
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => `${/^[a-z_$][\w$]*$/i.test(k) ? k : `'${k}'`}: ${literal(v, depth + 1)}`)
    const flat = `{ ${entries.join(', ')} }`
    if (flat.length <= 56 && !flat.includes('\n')) return flat
    const pad = INDENT.repeat(depth + 1)
    return `{\n${entries.map((entry) => pad + entry).join(',\n')},\n${INDENT.repeat(depth)}}`
  }
  return String(value)
}

function attribute(key: string, value: unknown, depth: number): string {
  if (value === true) return key
  if (typeof value === 'string' && !/["\n]/.test(value)) return `${key}="${value}"`
  return `${key}={${literal(value, depth)}}`
}

function childLines(children: ReactNode, depth: number): string[] {
  const list = Array.isArray(children) ? children : [children]
  return list
    .filter((child) => child !== undefined && child !== null && child !== false && child !== '')
    .map((child) => (isValidElement(child) ? elementToJsx(child, depth) : String(child)))
}

export function toJsx(name: string, props: Record<string, unknown> = {}, children?: ReactNode, depth = 0): string {
  const pad = INDENT.repeat(depth)
  const attrs = Object.entries(props)
    .filter(([key, value]) => value !== undefined && key !== 'children')
    .map(([key, value]) => attribute(key, value, depth + 1))
  const flat = attrs.join(' ')
  const inline = attrs.length === 0 || (flat.length <= 64 && !flat.includes('\n'))
  const open = inline ? `<${name}${attrs.length ? ` ${flat}` : ''}` : `<${name}\n${attrs.map((a) => pad + INDENT + a).join('\n')}\n${pad}`
  const kids = childLines(children, depth + 1)

  if (kids.length === 0) return `${open}${inline ? ' />' : '/>'}`
  if (kids.length === 1 && !kids[0].includes('\n') && kids[0].length <= 48 && !isValidElement(children)) {
    return `${open}>${kids[0]}</${name}>`
  }
  return `${open}>\n${kids.map((k) => pad + INDENT + k).join('\n')}\n${pad}</${name}>`
}

/* ────────────────────────────────────────────────────────────────
 * Variant helpers
 * ──────────────────────────────────────────────────────────────── */

// Any-typed on purpose: the registry stores heterogeneous components side by side.
// oxlint-disable-next-line typescript/no-explicit-any
type AnyComponent = ComponentType<any>
type Item = [name: string, component: AnyComponent, props: Record<string, unknown>, children?: ReactNode]

type VariantOptions = Partial<Pick<Variant, 'note' | 'surface' | 'maxWidth' | 'code'>>

/** One live component + generated code. */
function story(id: string, name: string, item: Item, options: VariantOptions = {}): Variant {
  const [componentName, Component, props, children] = item
  return {
    id,
    name,
    element: createElement(Component, props, children),
    code: toJsx(componentName, props, children),
    ...options,
  }
}

/** Several components side by side in one preview. */
function row(id: string, name: string, items: Item[], options: VariantOptions = {}): Variant {
  return {
    id,
    name,
    element: (
      <div className="sg-row">
        {items.map(([, Component, props, children], index) => createElement(Component, { key: index, ...props }, children))}
      </div>
    ),
    code: items.map(([componentName, , props, children]) => toJsx(componentName, props, children)).join('\n'),
    ...options,
  }
}

/** Free-form preview with hand-written code. */
function custom(id: string, name: string, element: ReactNode, code: string, options: VariantOptions = {}): Variant {
  return { id, name, element, code, ...options }
}

/* ────────────────────────────────────────────────────────────────
 * Sample data used by variants
 * ──────────────────────────────────────────────────────────────── */

const [hvac, electrical] = services
const sampleJob = jobs[0]
const heroProps = { tag: 'Electrical', headlineLead: 'Lights out?', headlineAccent: 'We’ll sort it today.', copy: 'Tripped breakers, dead outlets, flickering lights — one licensed crew, one call, fixed right the first time.' }

/* ────────────────────────────────────────────────────────────────
 * Registry
 * ──────────────────────────────────────────────────────────────── */

export const specimens: Specimen[] = [
  /* Foundations */
  { id: 'colors', group: 'foundations', title: 'Colour', summary: 'Palette, semantic tokens and verified text contrast.', source: 'styleguide/css/theme.css', content: <ColorsSpecimen /> },
  { id: 'typography', group: 'foundations', title: 'Typography', summary: 'Two families and an eight-step fluid scale.', source: 'styleguide/css/components.css', content: <TypographySpecimen /> },
  { id: 'spacing', group: 'foundations', title: 'Spacing & shape', summary: 'Spacing scale, radius, elevation and layout tokens.', source: 'styleguide/css/tokens.css', content: <SpacingSpecimen /> },
  { id: 'motion', group: 'foundations', title: 'Motion', summary: 'Easing curves, durations and the rules behind them.', source: 'styleguide/css/tokens.css', content: <MotionSpecimen /> },
  { id: 'icons', group: 'foundations', title: 'Icons', summary: 'The Font Awesome icons in use.', source: 'src/components/Icon.tsx', content: <IconsSpecimen /> },

  /* Components */
  {
    id: 'button',
    group: 'components',
    title: 'Button',
    summary: 'The primary action. Renders a <button>, or an <a> when given an href.',
    source: 'src/components/Button.tsx',
    guidance: ['One primary (orange) button per view. Secondary is for the alternative, like “Call now”.', 'Primary text is near-black, not white — white on orange fails contrast.'],
    variants: [
      row('variants', 'Variants', [
        ['Button', Button, { href: '#quote', icon: 'fa-arrow-right' }, 'Get a free quote'],
        ['Button', Button, { variant: 'secondary', href: '#', icon: 'fa-phone', iconPosition: 'start' }, 'Call now'],
        ['Button', Button, { variant: 'ghost' }, 'Learn more'],
      ]),
      row('dark', 'Dark — for copper and sand surfaces', [['Button', Button, { variant: 'dark', icon: 'fa-arrow-down' }, 'Request a quote online']], { surface: 'sand' }),
      row('sizes', 'Sizes', [
        ['Button', Button, { size: 'sm' }, 'Small'],
        ['Button', Button, {}, 'Medium'],
        ['Button', Button, { size: 'lg' }, 'Large'],
      ]),
      row('states', 'Disabled', [['Button', Button, { disabled: true }, 'Sending…']]),
    ],
    props: [
      { name: 'variant', type: "'primary' | 'secondary' | 'dark' | 'ghost'", default: "'primary'", description: 'Visual style.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height and type size. lg is 52px tall.' },
      { name: 'icon', type: 'string', description: 'Font Awesome class, e.g. fa-arrow-right.' },
      { name: 'iconPosition', type: "'start' | 'end'", default: "'end'", description: 'Which side the icon sits on.' },
      { name: 'href', type: 'string', description: 'When set, renders an anchor instead of a button.' },
      { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: 'Button type. Ignored for links.' },
      { name: 'disabled', type: 'boolean', description: 'Dims and blocks pointer events.' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Label.' },
    ],
  },
  {
    id: 'text-link',
    group: 'components',
    title: 'Text link',
    summary: 'Tracked-caps link with an arrow that nudges on hover.',
    source: 'src/components/TextLink.tsx',
    variants: [
      row('tones', 'Copper and light', [
        ['TextLink', TextLink, { href: '#' }, 'HVAC services'],
        ['TextLink', TextLink, { href: '#', tone: 'light' }, 'See our work'],
      ]),
      row('navy', 'Navy — on sand', [['TextLink', TextLink, { href: '#', tone: 'navy' }, 'How we work']], { surface: 'sand' }),
      row('no-icon', 'Without icon', [['TextLink', TextLink, { href: '#', icon: false }, 'Service area']]),
    ],
    props: [
      { name: 'href', type: 'string', required: true, description: 'Destination.' },
      { name: 'tone', type: "'copper' | 'light' | 'navy'", default: "'copper'", description: 'Colour, chosen for the surface behind it.' },
      { name: 'icon', type: 'string | false', default: "'fa-arrow-right'", description: 'Trailing icon, or false for none.' },
    ],
  },
  {
    id: 'eyebrow',
    group: 'components',
    title: 'Eyebrow',
    summary: 'Small tracked label above a heading.',
    source: 'src/components/Eyebrow.tsx',
    variants: [
      story('default', 'Default', ['Eyebrow', Eyebrow, {}, 'Three trades, one call']),
      story('sand', 'Sand', ['Eyebrow', Eyebrow, { tone: 'sand' }, 'How a job runs'], { surface: 'sand' }),
    ],
    props: [{ name: 'tone', type: "'default' | 'sand'", default: "'default'", description: 'Use sand on the sand and copper surfaces.' }],
  },
  {
    id: 'tag',
    group: 'components',
    title: 'Tag',
    summary: 'Outlined copper badge, used as the hero kicker.',
    source: 'src/components/Tag.tsx',
    variants: [story('default', 'Default', ['Tag', Tag, {}, 'HVAC · Electrical · Plumbing'])],
    props: [{ name: 'children', type: 'ReactNode', required: true, description: 'Short label.' }],
  },
  {
    id: 'chip',
    group: 'components',
    title: 'Chip',
    summary: 'Quick-pick pill. A link when it has an href, a toggle button when it doesn’t.',
    source: 'src/components/Chip.tsx',
    variants: [
      story('row', 'Chip row', ['ChipRow', ChipRow, { label: 'What’s going on?', chips: symptoms }]),
      row('toggle', 'Toggle chips', [
        ['Chip', Chip, { selected: false }, 'Off'],
        ['Chip', Chip, { selected: true }, 'On'],
      ]),
    ],
    props: [
      { name: 'href', type: 'string', description: 'Renders an anchor. Without it the chip is a toggle button.' },
      { name: 'selected', type: 'boolean', description: 'aria-pressed state for toggle chips.' },
      { name: 'ChipRow.label', type: 'string', required: true, description: 'Visible label, also names the group for screen readers.' },
      { name: 'ChipRow.chips', type: '{ label, href }[]', required: true, description: 'Chips to render.' },
    ],
  },
  {
    id: 'section-heading',
    group: 'components',
    title: 'Section heading',
    summary: 'Eyebrow, heading and optional lead copy as one unit.',
    source: 'src/components/SectionHeading.tsx',
    variants: [
      story('dark', 'Dark', ['SectionHeading', SectionHeading, { eyebrow: 'Three trades, one call', title: 'The systems that keep a house running', copy: 'Most jobs touch more than one trade. We handle the whole job.' }], { maxWidth: '34rem' }),
      story('sand', 'Sand', ['SectionHeading', SectionHeading, { tone: 'sand', eyebrow: 'How a job runs', title: 'No surprises. Start to finish.' }], { surface: 'sand', maxWidth: '34rem' }),
    ],
    props: [
      { name: 'eyebrow', type: 'string', description: 'Label above the heading.' },
      { name: 'title', type: 'string', required: true, description: 'Heading text. Write sentence case — CSS uppercases it.' },
      { name: 'copy', type: 'ReactNode', description: 'Lead paragraph.' },
      { name: 'tone', type: "'dark' | 'sand'", default: "'dark'", description: 'Text colours for the surface behind.' },
      { name: 'as', type: "'h1' | 'h2' | 'h3'", default: "'h2'", description: 'Heading level; the size never changes.' },
      { name: 'id', type: 'string', description: 'Heading id, for aria-labelledby on the section.' },
    ],
  },
  {
    id: 'checklist',
    group: 'components',
    title: 'Checklist',
    summary: 'Ticked feature list.',
    source: 'src/components/Checklist.tsx',
    variants: [story('default', 'Default', ['Checklist', Checklist, { items: hvac.items }], { maxWidth: '24rem' })],
    props: [{ name: 'items', type: 'string[]', required: true, description: 'One line each.' }],
  },
  {
    id: 'service-card',
    group: 'components',
    title: 'Service card',
    summary: 'Trade card: copper band, title, description, checklist and link.',
    source: 'src/components/ServiceCard.tsx',
    variants: [
      story('hvac', 'HVAC', ['ServiceCard', ServiceCard, { ...hvac }], { maxWidth: '40rem' }),
      story('electrical', 'Electrical', ['ServiceCard', ServiceCard, { ...electrical }], { maxWidth: '40rem' }),
    ],
    props: [
      { name: 'id', type: 'string', description: 'Anchor id so the nav can deep-link.' },
      { name: 'index', type: 'string', required: true, description: 'Two-digit position, e.g. “01”.' },
      { name: 'category', type: 'string', required: true, description: 'Band label next to the index.' },
      { name: 'icon', type: 'string', required: true, description: 'Font Awesome class for the band.' },
      { name: 'title', type: 'string', required: true, description: 'Trade name.' },
      { name: 'description', type: 'string', required: true, description: 'One-sentence summary.' },
      { name: 'items', type: 'string[]', required: true, description: 'Checklist lines — keep it to four.' },
      { name: 'href / linkLabel', type: 'string', required: true, description: 'Footer link.' },
    ],
  },
  {
    id: 'process-step',
    group: 'components',
    title: 'Process step',
    summary: 'Big numeral, short title and one line of detail.',
    source: 'src/components/ProcessStep.tsx',
    guidance: ['Always list steps in an <ol>. The numeral is decorative (aria-hidden); the list provides the order.'],
    variants: [story('default', 'Default', ['ProcessStep', ProcessStep, { ...processSteps[1] }], { surface: 'sand', maxWidth: '16rem' })],
    props: [
      { name: 'step', type: 'number | string', required: true, description: 'The numeral.' },
      { name: 'title', type: 'string', required: true, description: 'Step name.' },
      { name: 'description', type: 'string', required: true, description: 'One sentence.' },
    ],
  },
  {
    id: 'job-card',
    group: 'components',
    title: 'Job card',
    summary: 'Photo with trade · town meta and a project title.',
    source: 'src/components/JobCard.tsx',
    guidance: ['Photos live in src/assets and are cropped to 4:3. Without a photoUrl the card shows a trade icon, so layouts hold while photos are being collected.'],
    variants: [
      story('photo', 'With photo', ['JobCard', JobCard, { ...sampleJob }], { maxWidth: '22rem', code: toJsx('JobCard', { ...sampleJob, photoUrl: '/src/assets/hvac.jpeg' }) }),
      story('placeholder', 'No photo yet', ['JobCard', JobCard, { ...sampleJob, photoUrl: undefined }], { maxWidth: '22rem' }),
    ],
    props: [
      { name: 'photoUrl', type: 'string', description: 'Image source. Omit for the placeholder tile.' },
      { name: 'alt', type: 'string', required: true, description: 'Describes the photo; also labels the placeholder.' },
      { name: 'trade', type: 'string', required: true, description: 'HVAC, Electrical or Plumbing — picks the placeholder icon.' },
      { name: 'town', type: 'string', required: true, description: 'Where the job was.' },
      { name: 'title', type: 'string', required: true, description: 'What was done.' },
    ],
  },
  {
    id: 'text-field',
    group: 'components',
    title: 'Text field',
    summary: 'Labelled input and textarea with hint and error states.',
    source: 'src/components/Field.tsx',
    guidance: ['Inputs are 16px so iOS doesn’t zoom on focus. Labels are always visible — placeholders are examples, not labels.'],
    variants: [
      story('default', 'Input', ['TextField', TextField, { label: 'Name', name: 'name', autoComplete: 'name' }], { maxWidth: '22rem' }),
      story('hint', 'With hint', ['TextField', TextField, { label: 'Phone', name: 'phone', type: 'tel', hint: 'We’ll only call about your job.' }], { maxWidth: '22rem' }),
      story('error', 'Error', ['TextField', TextField, { label: 'Phone', name: 'phone', type: 'tel', defaultValue: '555', error: 'Enter a 10-digit phone number.' }], { maxWidth: '22rem' }),
      story('textarea', 'Textarea', ['TextArea', TextArea, { label: 'What’s going on?', name: 'details', placeholder: 'Tell us what you’re seeing…' }], { maxWidth: '28rem' }),
    ],
    props: [
      { name: 'label', type: 'string', required: true, description: 'Visible label, wired to the input.' },
      { name: 'name', type: 'string', required: true, description: 'Form field name.' },
      { name: 'type', type: "'text' | 'tel' | 'email'", default: "'text'", description: 'TextField only.' },
      { name: 'hint', type: 'string', description: 'Helper text below the field.' },
      { name: 'error', type: 'string', description: 'Replaces the hint, turns the field red and sets aria-invalid.' },
      { name: 'required / defaultValue / placeholder', type: 'misc', description: 'Passed to the control.' },
      { name: 'rows', type: 'number', default: '5', description: 'TextArea only.' },
    ],
  },
  {
    id: 'radio-pills',
    group: 'components',
    title: 'Radio pills',
    summary: 'Single-choice group styled as pills, on real radio inputs.',
    source: 'src/components/RadioPills.tsx',
    variants: [story('default', 'Default', ['RadioPills', RadioPills, { legend: 'What do you need?', name: 'trade', options: tradeOptions, defaultValue: 'hvac' }])],
    props: [
      { name: 'legend', type: 'string', required: true, description: 'Group label (a real <legend>).' },
      { name: 'name', type: 'string', required: true, description: 'Radio group name.' },
      { name: 'options', type: '{ value, label }[]', required: true, description: 'Choices.' },
      { name: 'defaultValue', type: 'string', description: 'Initially selected value.' },
    ],
  },
  {
    id: 'quote-card',
    group: 'components',
    title: 'Quote card',
    summary: 'Copper call-out with the emergency number and a jump link.',
    source: 'src/components/QuoteCard.tsx',
    variants: [
      story('default', 'Default', ['QuoteCard', QuoteCard, { eyebrow: 'Free quote', title: 'Big or small, we do it all.', copy: `Tell us what’s going on. We’ll call back within ${site.responseTime} with a time and a price range.`, emergencyLabel: 'Emergency? Skip the form', phone: site.phone, phoneHref: site.phoneHref, ctaLabel: 'Request a quote online', ctaHref: '#quote' }], { maxWidth: '34rem' }),
    ],
    props: [
      { name: 'eyebrow / emergencyLabel', type: 'string', description: 'Optional labels.' },
      { name: 'title / copy', type: 'string', required: true, description: 'Heading and supporting sentence.' },
      { name: 'phone / phoneHref', type: 'string', required: true, description: 'Number shown and its tel: link.' },
      { name: 'ctaLabel / ctaHref', type: 'string', required: true, description: 'Dark button that jumps to the form.' },
    ],
  },
  {
    id: 'house-diagram',
    group: 'components',
    title: 'House diagram',
    summary: 'Cut-away illustration: ducts, wiring and pipes in one structure.',
    source: 'src/components/HouseDiagram.tsx',
    guidance: ['Line colours mirror the trades everywhere else: cream dashes = HVAC, orange = electrical, blue = plumbing.'],
    variants: [
      story('default', 'With legend', ['HouseDiagram', HouseDiagram, {}], { maxWidth: '32rem' }),
      story('no-legend', 'Without legend', ['HouseDiagram', HouseDiagram, { showLegend: false }], { maxWidth: '32rem' }),
    ],
    props: [
      { name: 'label', type: 'string', description: 'Accessible description of the illustration.' },
      { name: 'showLegend', type: 'boolean', default: 'true', description: 'Show the three-line legend below.' },
    ],
  },
  {
    id: 'logo',
    group: 'components',
    title: 'Logo',
    summary: 'The Steadfast badge and emblem, from the brand SVGs.',
    source: 'src/components/Logo.tsx',
    guidance: ['Brand files live in src/assets (steadfast-logo.svg, steadfast-emblem.svg). Use the full badge when there is room; the emblem alone for tight spots.'],
    variants: [
      row('full', 'Full badge', [
        ['Logo', Logo, { size: 240 }],
        ['Logo', Logo, { size: 120 }],
      ]),
      row('emblem', 'Emblem', [['Logo', Logo, { variant: 'emblem', size: 200 }]]),
    ],
    props: [
      { name: 'variant', type: "'full' | 'emblem'", default: "'full'", description: 'Badge with name and tagline, or the house mark alone.' },
      { name: 'size', type: 'number', default: '240', description: 'Width in px; height follows the aspect ratio.' },
      { name: 'alt', type: 'string', description: 'Override the default accessible name.' },
    ],
  },
  {
    id: 'footer-column',
    group: 'components',
    title: 'Footer column',
    summary: 'Titled link list. Items without an href render as plain text.',
    source: 'src/components/FooterColumn.tsx',
    variants: [
      story('links', 'Links', ['FooterColumn', FooterColumn, { ...footerColumns[0] }], { maxWidth: '14rem' }),
      story('contact', 'Contact', ['FooterColumn', FooterColumn, { ...footerColumns[2] }], { maxWidth: '14rem' }),
    ],
    props: [
      { name: 'title', type: 'string', required: true, description: 'Column heading; also names the <nav>.' },
      { name: 'links', type: '{ label, href?, strong? }[]', required: true, description: 'Items. strong brightens and bolds (phone number).' },
    ],
  },

  /* Layout */
  {
    id: 'container-section',
    group: 'layout',
    title: 'Container & section',
    summary: 'The two building blocks every band is made of.',
    source: 'src/layout/Container.tsx, Section.tsx',
    bleed: true,
    guidance: ['Section owns vertical rhythm and background; Container owns the max width and gutters. Sections go inside <main>.'],
    variants: [
      custom(
        'tones',
        'Section tones',
        <>
          <Section tone="deep">
            <p className="sg-placeholder">tone=&quot;deep&quot; — page background</p>
          </Section>
          <Section tone="page">
            <p className="sg-placeholder">tone=&quot;page&quot; — lifted band</p>
          </Section>
          <Section tone="sand">
            <p className="sg-placeholder sg-placeholder--sand">tone=&quot;sand&quot; — warm band</p>
          </Section>
        </>,
        `<Section tone="deep">…</Section>\n<Section tone="page">…</Section>\n<Section tone="sand">…</Section>`,
      ),
      custom(
        'container',
        'Container',
        <div style={{ paddingBlock: '2rem' }}>
          <Container>
            <p className="sg-placeholder">Content column — max 75rem, fluid gutters</p>
          </Container>
        </div>,
        `<Container>\n  …\n</Container>`,
      ),
    ],
    props: [
      { name: 'Section.tone', type: "'deep' | 'page' | 'sand'", default: "'deep'", description: 'Background.' },
      { name: 'Section.id', type: 'string', description: 'Anchor id.' },
      { name: 'Section.labelledBy', type: 'string', description: 'id of the heading naming the region.' },
      { name: 'Section.contained', type: 'boolean', default: 'true', description: 'Wrap children in a Container. Turn off for full-bleed layouts.' },
    ],
  },
  {
    id: 'topbar',
    group: 'layout',
    title: 'Topbar',
    summary: 'Utility strip: emergency promise, licence, phone.',
    source: 'src/layout/Topbar.tsx',
    bleed: true,
    variants: [story('default', 'Default', ['Topbar', Topbar, {}])],
    props: [
      { name: 'message', type: 'string', description: 'Left-hand promise.' },
      { name: 'license', type: 'string', description: 'Hidden under 40rem to keep the strip to one line.' },
      { name: 'phone / phoneHref', type: 'string', description: 'Number and tel: link.' },
    ],
  },
  {
    id: 'header',
    group: 'layout',
    title: 'Header',
    summary: 'Sticky primary navigation.',
    source: 'src/layout/Header.tsx',
    bleed: true,
    guidance: ['Sticky in the real page; the styleguide frame pins it in place so previews don’t jump.', 'Scrolls horizontally on narrow screens rather than wrapping.'],
    variants: [story('default', 'Default', ['Header', Header, {}]), story('current', 'With current page', ['Header', Header, { currentHref: '#work' }])],
    props: [
      { name: 'links', type: '{ label, href }[]', description: 'Defaults to navLinks in src/data/site.ts.' },
      { name: 'currentHref', type: 'string', description: 'Link to mark aria-current="page".' },
    ],
  },
  {
    id: 'hero',
    group: 'layout',
    title: 'Hero',
    summary: 'Logo, kicker, headline, two calls to action and symptom chips.',
    source: 'src/layout/Hero.tsx',
    bleed: true,
    guidance: ['The headline has two parts: a white lead and a copper accent line.', 'The workshop photo (src/assets/hero-bg.webp) is the default; an overlay keeps text legible. Pass backgroundUrl to swap it, or an empty string to remove it.'],
    variants: [story('default', 'Default', ['Hero', Hero, {}]), story('copy', 'Custom copy', ['Hero', Hero, heroProps]), story('plain', 'No background photo', ['Hero', Hero, { backgroundUrl: '' }])],
    props: [
      { name: 'tag', type: 'string', description: 'Kicker above the headline.' },
      { name: 'headlineLead / headlineAccent', type: 'string', description: 'White line, then copper line.' },
      { name: 'copy', type: 'string', description: 'Supporting paragraph.' },
      { name: 'primaryCta / secondaryCta', type: '{ label, href }', description: 'Orange quote button and outlined call button.' },
      { name: 'symptomsLabel / symptoms', type: 'string / { label, href }[]', description: 'Chip row under the hero.' },
      { name: 'backgroundUrl', type: 'string', default: 'hero-bg.webp', description: 'Photo behind the hero. Empty string for none.' },
    ],
  },
  {
    id: 'services-section',
    group: 'layout',
    title: 'Services section',
    summary: 'Intro on the left, three stacked service cards on the right.',
    source: 'src/layout/ServicesSection.tsx',
    bleed: true,
    variants: [story('default', 'Default', ['ServicesSection', ServicesSection, {}])],
    props: [
      { name: 'eyebrow / title / copy', type: 'string', description: 'Intro text.' },
      { name: 'services', type: 'ServiceCardProps[]', description: 'Defaults to services in src/data/site.ts.' },
    ],
  },
  {
    id: 'process-section',
    group: 'layout',
    title: 'Process section',
    summary: 'Sand band with four numbered steps. 4 → 2 → 1 columns.',
    source: 'src/layout/ProcessSection.tsx',
    bleed: true,
    variants: [story('default', 'Default', ['ProcessSection', ProcessSection, {}])],
    props: [
      { name: 'eyebrow / title', type: 'string', description: 'Heading text.' },
      { name: 'steps', type: 'ProcessStepProps[]', description: 'Defaults to processSteps in src/data/site.ts.' },
    ],
  },
  {
    id: 'work-section',
    group: 'layout',
    title: 'Work section',
    summary: 'Heading row with a “see all” link above a three-up job grid.',
    source: 'src/layout/WorkSection.tsx',
    bleed: true,
    variants: [story('default', 'Default', ['WorkSection', WorkSection, {}])],
    props: [
      { name: 'eyebrow / title', type: 'string', description: 'Heading text.' },
      { name: 'jobs', type: 'JobCardProps[]', description: 'Defaults to jobs in src/data/site.ts.' },
      { name: 'linkLabel / linkHref', type: 'string', description: 'The “see our work” link.' },
    ],
  },
  {
    id: 'quote-section',
    group: 'layout',
    title: 'Quote section',
    summary: 'Copper call-out that bleeds off the left edge, beside the house diagram.',
    source: 'src/layout/QuoteSection.tsx',
    bleed: true,
    guidance: ['The card’s left padding is computed so its text still lines up with the container edge on wide screens.'],
    variants: [story('default', 'Default', ['QuoteSection', QuoteSection, {}])],
    props: [{ name: '…QuoteCardProps', type: 'Partial<QuoteCardProps>', description: 'Every field is optional and defaults to the site content.' }],
  },
  {
    id: 'quote-form',
    group: 'layout',
    title: 'Quote form',
    summary: 'Intro beside the request form: name, phone, trade, details.',
    source: 'src/layout/QuoteForm.tsx',
    bleed: true,
    guidance: ['The form has no backend yet. Pass onSubmit to receive the FormData — until then, submitting does nothing.'],
    variants: [story('default', 'Default', ['QuoteForm', QuoteForm, {}])],
    props: [
      { name: 'eyebrow / title / copy', type: 'string', description: 'Intro text.' },
      { name: 'onSubmit', type: '(data: FormData) => void', description: 'Receives the submitted fields.' },
    ],
  },
  {
    id: 'footer',
    group: 'layout',
    title: 'Footer',
    summary: 'Logo, three link columns and the legal line.',
    source: 'src/layout/Footer.tsx',
    bleed: true,
    variants: [story('default', 'Default', ['Footer', Footer, {}])],
    props: [{ name: 'columns', type: 'FooterColumnProps[]', description: 'Defaults to footerColumns in src/data/site.ts.' }],
  },
  {
    id: 'layout-shell',
    group: 'layout',
    title: 'Layout shell',
    summary: 'Skip link, topbar, nav, <main> and footer around any page.',
    source: 'src/layout/Layout.tsx',
    bleed: true,
    guidance: ['Layout renders the .page element, which is the container-query root for the whole design — keep every section inside it.'],
    variants: [
      custom(
        'default',
        'Empty shell',
        <Layout>
          <Section>
            <p className="sg-placeholder">Page content goes here</p>
          </Section>
        </Layout>,
        `<Layout>\n  <Section>\n    …\n  </Section>\n</Layout>`,
      ),
    ],
    props: [
      { name: 'topbar', type: 'boolean', default: 'true', description: 'Show the utility strip.' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Page sections.' },
    ],
  },

  /* Pages */
  {
    id: 'home',
    group: 'pages',
    title: 'Home page',
    summary: 'Every section in order, populated from src/data/site.ts.',
    source: 'src/layout/HomePage.tsx',
    bleed: true,
    guidance: ['Edit copy in src/data/site.ts. Anything in [BRACKETS] is a placeholder to replace before launch.'],
    variants: [story('default', 'Full page', ['HomePage', HomePage, {}])],
    props: [{ name: 'hero', type: 'HeroProps', description: 'Override hero props, e.g. to add a background photo.' }],
  },
]
