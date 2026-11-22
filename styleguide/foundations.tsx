/**
 * Foundation pages — colour, type, spacing, motion, icons.
 * Rendered as custom `content` by the registry in ./specimen.tsx.
 * Colour values are read from the live CSS custom properties, never copied, so they can't go stale.
 */
import { useState, useSyncExternalStore } from 'react'
import { Button, Chip, Icon } from '../src/components'

const noopSubscribe = () => () => {}

/** Resolved value of a CSS custom property on :root (so docs always show the real hex). */
function useCssVar(name: string): string {
  return useSyncExternalStore(
    noopSubscribe,
    () => getComputedStyle(document.documentElement).getPropertyValue(name).trim(),
    () => '',
  )
}

function parseHex(hex: string): [number, number, number] | null {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex)
  if (!match) return null
  let digits = match[1]
  if (digits.length === 3) digits = digits.replace(/./g, (c) => c + c)
  const n = parseInt(digits, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function luminance([r, g, b]: [number, number, number]): number {
  const [lr, lg, lb] = [r, g, b].map((channel) => {
    const c = channel / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb
}

function contrastRatio(fg: string, bg: string): number | null {
  const a = parseHex(fg)
  const b = parseHex(bg)
  if (!a || !b) return null
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

function Swatch({ token, label }: { token: string; label?: string }) {
  const value = useCssVar(`--${token}`)
  return (
    <li className="sg-swatch">
      <span className="sg-swatch__chip" style={{ background: `var(--${token})` }} />
      <span className="sg-swatch__name">{label ?? token.replace('color-', '')}</span>
      <code className="sg-swatch__value">{value || '…'}</code>
      <code className="sg-swatch__token">var(--{token})</code>
    </li>
  )
}

const palette: Array<{ title: string; note: string; tokens: string[] }> = [
  { title: 'Ink', note: 'Dark neutrals. 950 is the page, 800 is a card, 600 is a hairline.', tokens: ['ink-950', 'ink-900', 'ink-800', 'ink-700', 'ink-600', 'ink-500', 'ink-300', 'ink-100'] },
  { title: 'Copper & sand', note: 'The brand metal. Accents on dark, and the warm “process” band.', tokens: ['copper-200', 'copper-300', 'copper-400', 'copper-500', 'sand-300'] },
  { title: 'Navy', note: 'Text that sits on sand and copper.', tokens: ['navy-900', 'navy-700'] },
  { title: 'Flame', note: 'The call-to-action colour. If it’s orange and clickable, it’s the primary action.', tokens: ['flame-500', 'flame-600'] },
  { title: 'Water', note: 'Plumbing lines, footer headings and the focus ring.', tokens: ['water-400', 'water-500'] },
]

const semantic: Array<{ title: string; tokens: string[] }> = [
  { title: 'Surfaces', tokens: ['surface-deep', 'surface-page', 'surface-card', 'surface-raised', 'surface-sand'] },
  { title: 'Borders', tokens: ['border-subtle', 'border-strong'] },
  { title: 'Text', tokens: ['text-primary', 'text-secondary', 'text-muted', 'text-accent', 'text-eyebrow', 'text-on-sand', 'text-on-sand-muted'] },
  { title: 'Accent', tokens: ['accent-cta', 'accent-cta-hover', 'focus-ring'] },
]

const contrastPairs: Array<{ fg: string; bg: string; use: string }> = [
  { fg: '--text-primary', bg: '--surface-page', use: 'Body text on page' },
  { fg: '--text-secondary', bg: '--surface-card', use: 'Checklist items on cards' },
  { fg: '--text-muted', bg: '--surface-card', use: 'Card descriptions' },
  { fg: '--text-accent', bg: '--surface-page', use: 'Accent headline, links' },
  { fg: '--text-eyebrow', bg: '--surface-page', use: 'Eyebrow labels' },
  { fg: '--color-ink-950', bg: '--accent-cta', use: 'Primary button label' },
  { fg: '--color-ink-950', bg: '--color-copper-300', use: 'Service card band' },
  { fg: '--text-on-sand', bg: '--surface-sand', use: 'Headings on sand' },
  { fg: '--text-on-sand-muted', bg: '--surface-sand', use: 'Body on sand' },
]

function ContrastRow({ fg, bg, use }: { fg: string; bg: string; use: string }) {
  const fgValue = useCssVar(fg)
  const bgValue = useCssVar(bg)
  const ratio = contrastRatio(fgValue, bgValue)
  const grade = ratio === null ? '—' : ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA large' : 'Fail'
  return (
    <tr>
      <td>
        <span className="sg-contrast__sample" style={{ background: `var(${bg})`, color: `var(${fg})` }}>
          Aa
        </span>
      </td>
      <td>{use}</td>
      <td>
        <code>{fg.replace('--', '')}</code> on <code>{bg.replace('--', '')}</code>
      </td>
      <td className="sg-num">{ratio ? `${ratio.toFixed(2)}:1` : '…'}</td>
      <td>
        <span className="sg-badge" data-grade={grade === 'Fail' ? 'fail' : 'pass'}>
          {grade}
        </span>
      </td>
    </tr>
  )
}

export function ColorsSpecimen() {
  return (
    <div className="sg-doc">
      <section className="sg-block">
        <h3 className="sg-h3">Palette</h3>
        <p className="sg-muted">Raw colours, defined once in theme.css. Components never use these directly — they use the semantic tokens below.</p>
        {palette.map((group) => (
          <div className="sg-palette" key={group.title}>
            <div className="sg-palette__head">
              <h4 className="sg-h4">{group.title}</h4>
              <p className="sg-muted">{group.note}</p>
            </div>
            <ul className="sg-swatches list-reset">
              {group.tokens.map((token) => (
                <Swatch key={token} token={`color-${token}`} />
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="sg-block">
        <h3 className="sg-h3">Semantic tokens</h3>
        <p className="sg-muted">What a colour is for. Change these to re-theme; components follow.</p>
        {semantic.map((group) => (
          <div className="sg-palette" key={group.title}>
            <h4 className="sg-h4">{group.title}</h4>
            <ul className="sg-swatches list-reset">
              {group.tokens.map((token) => (
                <Swatch key={token} token={token} label={token} />
              ))}
            </ul>
          </div>
        ))}
        <div className="sg-palette">
          <h4 className="sg-h4">Copper gradient</h4>
          <div className="sg-gradient" style={{ background: 'var(--gradient-copper)' }} />
          <code className="sg-swatch__token">var(--gradient-copper)</code>
        </div>
      </section>

      <section className="sg-block">
        <h3 className="sg-h3">Contrast</h3>
        <p className="sg-muted">Every text pairing the site uses, computed live from the tokens. Body text needs 4.5:1 (AA).</p>
        <div className="sg-table-wrap">
          <table className="sg-table">
            <thead>
              <tr>
                <th scope="col">Sample</th>
                <th scope="col">Where</th>
                <th scope="col">Pair</th>
                <th scope="col">Ratio</th>
                <th scope="col">WCAG</th>
              </tr>
            </thead>
            <tbody>
              {contrastPairs.map((pair) => (
                <ContrastRow key={`${pair.fg}-${pair.bg}`} {...pair} />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

const typeScale: Array<{ cls: string; label: string; spec: string; sample: string }> = [
  { cls: 't-display', label: 'Display', spec: 'Barlow Condensed 800 · 40–72px · 0.98', sample: 'Heat, power & water.' },
  { cls: 't-h2', label: 'Heading 2', spec: 'Barlow Condensed 800 · 32–52px · 1.0', sample: 'The systems that keep a house running' },
  { cls: 't-h3', label: 'Heading 3', spec: 'Barlow Condensed 700 · 24–32px · 1.05', sample: 'Electrical' },
  { cls: 't-h4', label: 'Heading 4', spec: 'Barlow Condensed 700 · 18px · +0.04em', sample: 'We diagnose & quote' },
  { cls: 't-lead', label: 'Lead', spec: 'Barlow 400 · 16–18px · 1.6', sample: 'Most jobs touch more than one trade. We handle the whole job.' },
  { cls: 't-body', label: 'Body', spec: 'Barlow 400 · 16px · 1.55', sample: 'You see the problem and the price before any work starts. You decide.' },
  { cls: 't-small', label: 'Small', spec: 'Barlow 400 · 14px · 1.5', sample: 'No spam. We only call about your job.' },
  { cls: 't-label', label: 'Label', spec: 'Barlow Condensed 700 · 12px · +0.14em · caps', sample: 'Three trades, one call' },
]

export function TypographySpecimen() {
  return (
    <div className="sg-doc">
      <section className="sg-block">
        <h3 className="sg-h3">Families</h3>
        <div className="sg-families">
          <div className="sg-family sg-dark">
            <p className="sg-family__name">Barlow Condensed</p>
            <p className="sg-family__glyphs" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>
              Aa Bb Cc 0123
            </p>
            <p className="sg-muted-dark">Display and headings. Always uppercase. Weights 600, 700, 800.</p>
            <code className="sg-swatch__token">var(--font-display)</code>
          </div>
          <div className="sg-family sg-dark">
            <p className="sg-family__name">Barlow</p>
            <p className="sg-family__glyphs" style={{ fontFamily: 'var(--font-body)', fontWeight: 500 }}>
              Aa Bb Cc 0123
            </p>
            <p className="sg-muted-dark">Body copy, form input and buttons’ supporting text. Weights 400, 500, 600.</p>
            <code className="sg-swatch__token">var(--font-body)</code>
          </div>
        </div>
      </section>

      <section className="sg-block">
        <h3 className="sg-h3">Scale</h3>
        <p className="sg-muted">Sizes are fluid and follow the width of the page container, so they respond to the viewport frames in the toolbar too.</p>
        <div className="sg-type-list">
          {typeScale.map((row) => (
            <div className="sg-type sg-dark" key={row.cls}>
              <div className="sg-type__meta">
                <span className="sg-type__label">{row.label}</span>
                <code>.{row.cls}</code>
                <span className="sg-muted-dark">{row.spec}</span>
              </div>
              <p className={row.cls}>{row.sample}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

const spaceTokens = ['1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24']
const radiusTokens = [
  { token: 'xs', use: 'Hairline details' },
  { token: 'sm', use: 'Buttons, inputs, chips, tags' },
  { token: 'md', use: 'Cards and panels' },
  { token: 'lg', use: 'Quote call-out' },
  { token: 'pill', use: 'Reserved for status dots' },
]

export function SpacingSpecimen() {
  return (
    <div className="sg-doc">
      <section className="sg-block">
        <h3 className="sg-h3">Spacing</h3>
        <p className="sg-muted">4px base unit. Pick the nearest step — no one-off pixel values.</p>
        <ul className="sg-space list-reset">
          {spaceTokens.map((step) => (
            <li className="sg-space__row" key={step}>
              <code>--space-{step}</code>
              <span className="sg-space__bar" style={{ width: `var(--space-${step})` }} />
              <span className="sg-muted">{Number(step) * 4}px</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="sg-block">
        <h3 className="sg-h3">Radius</h3>
        <ul className="sg-radius list-reset">
          {radiusTokens.map((r) => (
            <li key={r.token}>
              <span className="sg-radius__box" style={{ borderRadius: `var(--radius-${r.token})` }} />
              <code>--radius-{r.token}</code>
              <span className="sg-muted">{r.use}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="sg-block">
        <h3 className="sg-h3">Elevation</h3>
        <ul className="sg-radius list-reset">
          {[
            { token: 'shadow-card', use: 'Cards sitting on the page' },
            { token: 'shadow-raised', use: 'The copper quote call-out' },
          ].map((s) => (
            <li key={s.token}>
              <span className="sg-radius__box sg-radius__box--dark" style={{ boxShadow: `var(--${s.token})`, borderRadius: 'var(--radius-md)' }} />
              <code>--{s.token}</code>
              <span className="sg-muted">{s.use}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="sg-block">
        <h3 className="sg-h3">Layout</h3>
        <ul className="sg-meta-list list-reset">
          <li>
            <code>--container</code> <span className="sg-muted">75rem — max content width</span>
          </li>
          <li>
            <code>--gutter</code> <span className="sg-muted">clamp(1rem, 4cqi, 3rem) — side padding, fluid with the container</span>
          </li>
          <li>
            <code>--header-h</code> <span className="sg-muted">3rem — sticky nav height, also the anchor scroll offset</span>
          </li>
        </ul>
        <p className="sg-muted">
          Breakpoints are <strong>container queries</strong> on <code>.page</code> (64rem, 52rem, 40rem), not media queries — so every pattern responds to the width it’s given, whether that’s the window or a styleguide frame.
        </p>
      </section>
    </div>
  )
}

const easings = [
  { token: '--ease-out', value: 'cubic-bezier(0.23, 1, 0.32, 1)', use: 'Default for anything the user triggers or that enters the screen. Starts fast, feels instant.' },
  { token: '--ease-in-out', value: 'cubic-bezier(0.77, 0, 0.175, 1)', use: 'Things already on screen that move or morph.' },
  { token: 'ease', value: 'ease', use: 'Colour and border changes on hover.' },
]

export function MotionSpecimen() {
  const [on, setOn] = useState(false)
  return (
    <div className="sg-doc">
      <section className="sg-block">
        <h3 className="sg-h3">Easing</h3>
        <p className="sg-muted">Built-in CSS easings are too weak, so the site uses stronger custom curves. Demos run at 600ms so the curve is visible — real UI stays under 300ms. Never use ease-in on UI: it delays the first frame, the moment people are watching.</p>
        <button type="button" className="sg-btn sg-btn--solid" onClick={() => setOn((v) => !v)}>
          <Icon name="fa-play" /> Play / reverse
        </button>
        <div className="sg-motion">
          {easings.map((e) => (
            <div className="sg-motion__row" key={e.token}>
              <div>
                <code>{e.token}</code>
                <p className="sg-muted">{e.use}</p>
              </div>
              <div className="sg-motion__track">
                <span className="sg-motion__dot" data-on={on} style={{ transitionTimingFunction: e.value }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="sg-block">
        <h3 className="sg-h3">Durations</h3>
        <div className="sg-table-wrap">
          <table className="sg-table">
            <thead>
              <tr>
                <th scope="col">Token</th>
                <th scope="col">Value</th>
                <th scope="col">Used for</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>--duration-press</code>
                </td>
                <td className="sg-num">160ms</td>
                <td>Press feedback — buttons, chips and pills scale to 0.97 on :active</td>
              </tr>
              <tr>
                <td>
                  <code>--duration-ui</code>
                </td>
                <td className="sg-num">200ms</td>
                <td>Colour, border and arrow nudges</td>
              </tr>
              <tr>
                <td>
                  <code>--duration-image</code>
                </td>
                <td className="sg-num">300ms</td>
                <td>Job photo zoom on hover</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="sg-block">
        <h3 className="sg-h3">Try the press feedback</h3>
        <div className="sg-dark sg-row sg-row--pad">
          <Button>Press me</Button>
          <Button variant="secondary">Press me</Button>
          <Chip selected={false}>Press me</Chip>
        </div>
      </section>

      <section className="sg-block">
        <h3 className="sg-h3">Rules</h3>
        <ul className="sg-rules">
          <li>Transition named properties only — never <code>transition: all</code>.</li>
          <li>Only animate <code>transform</code> and <code>opacity</code> when something moves.</li>
          <li>Hover effects live inside <code>@media (hover: hover) and (pointer: fine)</code> so touch screens never get stuck states.</li>
          <li>Keyboard-driven actions (nav, focus) don’t animate.</li>
          <li>Use transitions, not keyframes, for anything that can be re-triggered mid-flight.</li>
          <li>Never scale from 0 — start at 0.95 with opacity.</li>
        </ul>
      </section>
    </div>
  )
}

const iconList = ['fa-arrow-right', 'fa-arrow-down', 'fa-phone', 'fa-check', 'fa-fan', 'fa-bolt', 'fa-faucet-drip', 'fa-screwdriver-wrench']

export function IconsSpecimen() {
  return (
    <div className="sg-doc">
      <section className="sg-block">
        <h3 className="sg-h3">Font Awesome 6 (Free, solid)</h3>
        <p className="sg-muted">
          Loaded from the CDN in index.html. Always use the <code>Icon</code> component — it adds <code>aria-hidden</code> so icons never get read out. Never rely on an icon alone to carry meaning.
        </p>
        <ul className="sg-icons list-reset">
          {iconList.map((name) => (
            <li className="sg-icon" key={name}>
              <span className="sg-icon__glyph">
                <Icon name={name} />
              </span>
              <code>{name}</code>
            </li>
          ))}
        </ul>
        <pre className="sg-code sg-code--inline">
          <code>{`<Icon name="fa-bolt" />`}</code>
        </pre>
      </section>
    </div>
  )
}
