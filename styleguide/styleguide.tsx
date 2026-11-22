/**
 * Styleguide shell — a small Storybook / Pattern Lab style viewer.
 *
 *  - Sidebar groups every pattern (Foundations → Components → Layout → Pages) with search.
 *  - Each pattern page shows live variants in a resizable frame, a code snippet per
 *    variant, and a props table.
 *  - Routing is hash-based (#/components/button), so it works on any static host.
 *
 * What gets shown lives in ./specimen.tsx.
 */
import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import type { MouseEvent, RefObject } from 'react'
import { Icon, Logo, cx } from '../src/components'
import { groups, specimens } from './specimen'
import type { PropDoc, Specimen, Surface, Variant } from './specimen'

/* ── Routing ─────────────────────────────────────────────────── */

function subscribe(callback: () => void) {
  window.addEventListener('hashchange', callback)
  return () => window.removeEventListener('hashchange', callback)
}

function useRoute(): string {
  return useSyncExternalStore(
    subscribe,
    () => window.location.hash.replace(/^#/, '') || '/',
    () => '/',
  )
}

const hrefFor = (s: Specimen) => `#/${s.group}/${s.id}`

/* ── Toolbar options ─────────────────────────────────────────── */

const viewports = [
  { id: 'mobile', label: 'Mobile', width: 375, icon: 'fa-mobile-screen' },
  { id: 'tablet', label: 'Tablet', width: 768, icon: 'fa-tablet-screen-button' },
  { id: 'desktop', label: 'Desktop', width: null, icon: 'fa-desktop' },
] as const

type ViewportId = (typeof viewports)[number]['id']
type SurfaceChoice = 'auto' | Surface

const surfaceChoices: Array<{ id: SurfaceChoice; label: string }> = [
  { id: 'auto', label: 'Auto' },
  { id: 'dark', label: 'Dark' },
  { id: 'sand', label: 'Sand' },
  { id: 'light', label: 'Light' },
]

/* ── Pieces ──────────────────────────────────────────────────── */

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: Array<{ id: T; label: string; icon?: string }>
  onChange: (id: T) => void
}) {
  return (
    <div className="sg-seg" role="group" aria-label={label}>
      {options.map((option) => (
        <button key={option.id} type="button" className="sg-seg__btn" aria-pressed={value === option.id} onClick={() => onChange(option.id)}>
          {option.icon && <Icon name={option.icon} />}
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  )
}

function CodeBlock({ code, id }: { code: string; id: string }) {
  return (
    <pre className="sg-code" id={id} tabIndex={0}>
      <code>{code}</code>
    </pre>
  )
}

/** Links inside a preview are demos: stop them rewriting the styleguide's own #hash route. */
function containAnchors(event: MouseEvent<HTMLElement>) {
  const anchor = (event.target as HTMLElement).closest('a')
  const href = anchor?.getAttribute('href')
  if (!anchor || !href?.startsWith('#')) return
  event.preventDefault()
  if (href.length > 1) event.currentTarget.querySelector(href)?.scrollIntoView({ block: 'start' })
}

function VariantCard({ variant, bleed, viewport, surfaceChoice }: { variant: Variant; bleed: boolean; viewport: ViewportId; surfaceChoice: SurfaceChoice }) {
  const [showCode, setShowCode] = useState(false)
  const [copied, setCopied] = useState(false)
  const titleId = useId()
  const codeId = useId()
  const surface = surfaceChoice === 'auto' ? (variant.surface ?? 'dark') : surfaceChoice
  const width = viewports.find((v) => v.id === viewport)?.width ?? null

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 1500)
    return () => window.clearTimeout(timer)
  }, [copied])

  async function copy() {
    try {
      await navigator.clipboard.writeText(variant.code)
      setCopied(true)
    } catch {
      setShowCode(true)
    }
  }

  return (
    <section className="sg-variant" aria-labelledby={titleId}>
      <header className="sg-variant__head">
        <div>
          <h2 className="sg-h3" id={titleId}>
            {variant.name}
          </h2>
          {variant.note && <p className="sg-muted">{variant.note}</p>}
        </div>
        <div className="sg-variant__actions">
          <button type="button" className="sg-btn" aria-expanded={showCode} aria-controls={codeId} onClick={() => setShowCode((v) => !v)}>
            <Icon name="fa-code" /> Code
          </button>
          <button type="button" className="sg-btn" onClick={copy}>
            <Icon name={copied ? 'fa-check' : 'fa-copy'} /> {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </header>

      <div className="sg-canvas">
        <div
          className={cx('page', 'sg-frame', `sg-surface--${surface}`, bleed && 'sg-frame--bleed')}
          style={{ width: width ?? '100%' }}
          onClick={containAnchors}
        >
          {bleed ? variant.element : (
            <div className="sg-frame__pad">
              <div style={{ maxWidth: variant.maxWidth }}>{variant.element}</div>
            </div>
          )}
        </div>
      </div>

      {showCode && <CodeBlock code={variant.code} id={codeId} />}
    </section>
  )
}

function PropsTable({ props }: { props: PropDoc[] }) {
  return (
    <section className="sg-block" aria-labelledby="props-title">
      <h2 className="sg-h3" id="props-title">
        Props
      </h2>
      <div className="sg-table-wrap">
        <table className="sg-table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Type</th>
              <th scope="col">Default</th>
              <th scope="col">Description</th>
            </tr>
          </thead>
          <tbody>
            {props.map((prop) => (
              <tr key={prop.name}>
                <td>
                  <code className="sg-prop">{prop.name}</code>
                  {prop.required && (
                    <span className="sg-req" title="Required">
                      required
                    </span>
                  )}
                </td>
                <td>
                  <code>{prop.type}</code>
                </td>
                <td>{prop.default ? <code>{prop.default}</code> : <span className="sg-muted">—</span>}</td>
                <td>{prop.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function PrevNext({ current }: { current: Specimen }) {
  const index = specimens.indexOf(current)
  const prev = specimens[index - 1]
  const next = specimens[index + 1]
  return (
    <nav className="sg-prevnext" aria-label="Neighbouring patterns">
      {prev ? (
        <a className="sg-prevnext__link" href={hrefFor(prev)}>
          <span className="sg-muted">Previous</span>
          <strong>{prev.title}</strong>
        </a>
      ) : (
        <span />
      )}
      {next && (
        <a className="sg-prevnext__link sg-prevnext__link--next" href={hrefFor(next)}>
          <span className="sg-muted">Next</span>
          <strong>{next.title}</strong>
        </a>
      )}
    </nav>
  )
}

function SpecimenPage({ specimen, viewport, surfaceChoice, onViewport, onSurface }: {
  specimen: Specimen
  viewport: ViewportId
  surfaceChoice: SurfaceChoice
  onViewport: (id: ViewportId) => void
  onSurface: (id: SurfaceChoice) => void
}) {
  const group = groups.find((g) => g.id === specimen.group)
  return (
    <article className="sg-article">
      <header className="sg-head">
        <p className="sg-crumb">
          <a href="#/">Overview</a> <span aria-hidden="true">/</span> {group?.label}
        </p>
        <h1 className="sg-title">
          {specimen.title}
          {specimen.status === 'draft' && <span className="sg-badge sg-badge--draft">Draft</span>}
        </h1>
        <p className="sg-summary">{specimen.summary}</p>
        {specimen.source && (
          <p className="sg-source">
            <Icon name="fa-file-code" /> <code>{specimen.source}</code>
          </p>
        )}
      </header>

      {specimen.guidance && (
        <aside className="sg-guidance" aria-label="Usage guidance">
          <ul>
            {specimen.guidance.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </aside>
      )}

      {specimen.content}

      {specimen.variants && (
        <>
          <div className="sg-toolbar" role="toolbar" aria-label="Preview controls">
            <Segmented label="Viewport" value={viewport} options={viewports.map((v) => ({ id: v.id, label: v.label, icon: v.icon }))} onChange={onViewport} />
            <Segmented label="Background" value={surfaceChoice} options={surfaceChoices} onChange={onSurface} />
          </div>
          <div className="sg-variants">
            {specimen.variants.map((variant) => (
              <VariantCard key={`${specimen.id}-${variant.id}`} variant={variant} bleed={Boolean(specimen.bleed)} viewport={viewport} surfaceChoice={surfaceChoice} />
            ))}
          </div>
        </>
      )}

      {specimen.props && <PropsTable props={specimen.props} />}
      <PrevNext current={specimen} />
    </article>
  )
}

function Overview() {
  const counts = useMemo(
    () =>
      groups.map((group) => ({
        ...group,
        items: specimens.filter((s) => s.group === group.id),
      })),
    [],
  )
  return (
    <article className="sg-article">
      <header className="sg-head">
        <p className="sg-crumb">Overview</p>
        <h1 className="sg-title">Steadfast Solutions styleguide</h1>
        <p className="sg-summary">
          The living pattern library for the site: every token, component and layout template, rendered from the same code that ships. Pick a pattern in the sidebar, or press <kbd className="sg-kbd">/</kbd> to search.
        </p>
      </header>

      <ul className="sg-cards list-reset">
        {counts.map((group) => (
          <li key={group.id}>
            <a className="sg-card" href={hrefFor(group.items[0])}>
              <span className="sg-card__count">{group.items.length}</span>
              <span className="sg-card__title">{group.label}</span>
              <span className="sg-muted">{group.description}</span>
              <code className="sg-card__maps">{group.maps}</code>
            </a>
          </li>
        ))}
      </ul>

      <section className="sg-block">
        <h2 className="sg-h3">How it’s built</h2>
        <ul className="sg-rules">
          <li>
            <strong>Tokens first.</strong> Palette in <code>theme.css</code>, meaning in <code>tokens.css</code>. Components only touch semantic tokens.
          </li>
          <li>
            <strong>Container-query responsive.</strong> Patterns react to the width of <code>.page</code>, so the viewport toggle above each preview is a true test.
          </li>
          <li>
            <strong>Accessible by default.</strong> Real landmarks, labelled inputs, visible focus, 44px targets on touch, and contrast checked on the Colour page.
          </li>
          <li>
            <strong>Motion with purpose.</strong> Fast ease-out feedback, hover gated to real pointers, nothing animates on keyboard actions.
          </li>
          <li>
            <strong>Content lives in data.</strong> Copy is in <code>src/data/site.ts</code>; templates take props and fall back to it.
          </li>
        </ul>
      </section>

      <section className="sg-block">
        <h2 className="sg-h3">Adding a pattern</h2>
        <ol className="sg-rules">
          <li>
            Build it in <code>src/components</code> (small, reusable) or <code>src/layout</code> (a full-width section) and export it from that folder’s <code>index.ts</code>.
          </li>
          <li>
            Add its styles to <code>styleguide/css/components.css</code> or <code>layout.css</code>.
          </li>
          <li>
            Add one entry to <code>specimens</code> in <code>styleguide/specimen.tsx</code> — variants, props, guidance. Code snippets are generated for you.
          </li>
        </ol>
      </section>
    </article>
  )
}

function Sidebar({ route, query, onQuery, open, onNavigate, searchRef }: {
  route: string
  query: string
  onQuery: (value: string) => void
  open: boolean
  onNavigate: () => void
  searchRef: RefObject<HTMLInputElement | null>
}) {
  const q = query.trim().toLowerCase()
  const visible = specimens.filter((s) => !q || `${s.title} ${s.summary} ${s.id}`.toLowerCase().includes(q))

  return (
    <nav className="sg-nav" aria-label="Patterns" data-open={open}>
      <div className="sg-search">
        <Icon name="fa-magnifying-glass" />
        <input
          ref={searchRef}
          type="search"
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder="Search patterns"
          aria-label="Search patterns"
        />
        <kbd className="sg-kbd" aria-hidden="true">/</kbd>
      </div>

      <a className="sg-link sg-link--home" href="#/" aria-current={route === '/' ? 'page' : undefined} onClick={onNavigate}>
        Overview
      </a>

      {groups.map((group) => {
        const items = visible.filter((s) => s.group === group.id)
        if (items.length === 0) return null
        return (
          <div className="sg-group" key={group.id}>
            <p className="sg-group__title">{group.label}</p>
            <ul className="list-reset">
              {items.map((s) => (
                <li key={s.id}>
                  <a className="sg-link" href={hrefFor(s)} aria-current={route === `/${s.group}/${s.id}` ? 'page' : undefined} onClick={onNavigate}>
                    {s.title}
                    {s.status === 'draft' && <span className="sg-dot" title="Draft" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )
      })}

      {visible.length === 0 && <p className="sg-empty">No patterns match “{query}”.</p>}
    </nav>
  )
}

/* ── Root ────────────────────────────────────────────────────── */

export function Styleguide() {
  const route = useRoute()
  const [query, setQuery] = useState('')
  const [viewport, setViewport] = useState<ViewportId>('desktop')
  const [surfaceChoice, setSurfaceChoice] = useState<SurfaceChoice>('auto')
  const [navOpen, setNavOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  const current = specimens.find((s) => `/${s.group}/${s.id}` === route)

  useEffect(() => {
    document.title = current ? `${current.title} · Steadfast styleguide` : 'Steadfast styleguide'
    window.scrollTo({ top: 0 })
  }, [current])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement
      if (event.key !== '/' || target.closest('input, textarea, select, [contenteditable]')) return
      event.preventDefault()
      setNavOpen(true)
      searchRef.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="sg">
      <aside className="sg-side">
        <div className="sg-brand">
          <a href="#/" className="sg-brand__link" aria-label="Styleguide overview">
            <Logo variant="emblem" size={44} />
            <span>
              <strong>Steadfast</strong>
              <span className="sg-muted-dark">Styleguide</span>
            </span>
          </a>
          <button type="button" className="sg-navtoggle" aria-expanded={navOpen} onClick={() => setNavOpen((v) => !v)}>
            <Icon name={navOpen ? 'fa-xmark' : 'fa-bars'} />
            <span className="sg-sr">Patterns</span>
          </button>
        </div>
        <Sidebar route={route} query={query} onQuery={setQuery} open={navOpen} onNavigate={() => setNavOpen(false)} searchRef={searchRef} />
        <a className="sg-site-link" href="/">
          View live site <Icon name="fa-arrow-up-right-from-square" />
        </a>
      </aside>

      <main className="sg-main" id="main">
        {current ? (
          <SpecimenPage specimen={current} viewport={viewport} surfaceChoice={surfaceChoice} onViewport={setViewport} onSurface={setSurfaceChoice} />
        ) : (
          <Overview />
        )}
      </main>
    </div>
  )
}
