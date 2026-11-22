# Steadfast Solutions

Marketing site for **Steadfast Solutions**, a general contracting and repair business covering HVAC, electrical and plumbing ("Big or small, we do it all"). It is a single-page landing site with a quote request form, built on a small in-house design system. A bundled styleguide documents every component.

> **Before launch:** all contact details and some copy in [src/data/site.ts](src/data/site.ts) are `[BRACKETED]` placeholders (service area, license number, phone, email, hours, response time, job towns). Replace them, and set `phoneHref` to a real `tel:+1…` link.

## Contents

- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [Architecture](#architecture)
- [Editing site content](#editing-site-content)
- [Design system](#design-system)
- [Styleguide](#styleguide)
- [Components reference](#components-reference)
- [Layout reference](#layout-reference)
- [Quote form](#quote-form)
- [Accessibility](#accessibility)
- [Build and deployment](#build-and-deployment)
- [Linting and type checking](#linting-and-type-checking)
- [Conventions](#conventions)

## Tech stack

| Area | Tool |
| --- | --- |
| UI | React 19 with TypeScript |
| Build / dev server | Vite 8 with `@vitejs/plugin-react` |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`) plus hand-written component CSS driven by design tokens |
| Linting | Oxlint (react, typescript and oxc plugins) |
| Fonts | Barlow and Barlow Condensed (Google Fonts) |
| Icons | Font Awesome 6.5.2 (cdnjs) |

There is no router, state library, backend or test runner. The site is fully static.

## Getting started

Requires a recent Node.js (the `@types/node` version in use is 24) and npm.

```bash
npm install
npm run dev
```

Then open the URL Vite prints (normally `http://localhost:5173`).

- Site: `/`
- Styleguide: `/styleguide/`

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR. |
| `npm run build` | Type-check with `tsc -b`, then produce a production build in `dist/`. |
| `npm run preview` | Serve the production build locally. |
| `npm run lint` | Run Oxlint. |
| `npm run css:build` | Compile the design-system CSS to `styleguide/css/tailwind.css` (minified). |
| `npm run css:watch` | Same, in watch mode. |

`css:build` and `css:watch` use [styleguide/css/tailwind.src.css](styleguide/css/tailwind.src.css), a standalone entry that mirrors [src/index.css](src/index.css). They exist for consuming the CSS outside Vite. The app itself does not need them, because Vite compiles the CSS through the Tailwind plugin. The generated `styleguide/css/tailwind.css` is not git-ignored, so don't commit it by accident.

## Project structure

```
.
├── index.html                  Site entry (fonts, icons, #root)
├── vite.config.ts              Vite config, two HTML entries
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx                Mounts <App /> in StrictMode
│   ├── App.tsx                 Renders <HomePage />
│   ├── index.css               CSS entry: Tailwind layers + design-system CSS
│   ├── assets/                 Photos, hero background, logo and emblem SVGs
│   ├── data/
│   │   └── site.ts             All site copy and content (single source of truth)
│   ├── components/             Atoms and molecules (Button, Field, ServiceCard…)
│   │   └── index.ts            Barrel export (components and prop types)
│   └── layout/                 Page shell and full-width sections
│       └── index.ts            Barrel export
├── styleguide/
│   ├── index.html              Styleguide entry (served at /styleguide/, noindex)
│   ├── main.tsx                Mounts <Styleguide />
│   ├── styleguide.tsx          Viewer shell: sidebar, search, toolbar, routing
│   ├── specimen.tsx            What is documented: variants, code, prop tables
│   ├── foundations.tsx         Colour, type, spacing, motion and icon pages
│   └── css/                    The design system's CSS (see below)
├── .oxlintrc.json
├── tsconfig.json               Project references
├── tsconfig.app.json           App and styleguide type-check settings
└── tsconfig.node.json          Vite config type-check settings
```

The design-system CSS lives in `styleguide/css/` but is imported by the site too (through `src/index.css`). The styleguide is the home of the design system, and the site consumes it.

## Architecture

### Two entry points

[vite.config.ts](vite.config.ts) registers two Rollup inputs, so a single `vite build` emits both apps:

- `index.html` → `src/main.tsx` → the site
- `styleguide/index.html` → `styleguide/main.tsx` → the styleguide

Both import [src/index.css](src/index.css), so the styleguide always renders the real components with the real CSS.

### Layers: data → components → layout → page

1. **Data** ([src/data/site.ts](src/data/site.ts)): plain objects and arrays holding all copy.
2. **Components** ([src/components](src/components)): small, content-agnostic UI pieces that take props and render semantic markup with design-system class names.
3. **Layout** ([src/layout](src/layout)): the page shell and each full-width section. Sections read from `site.ts` and compose components.
4. **Page** ([src/layout/HomePage.tsx](src/layout/HomePage.tsx)): the landing page, with every section in order.

### Styling approach

Styling is plain CSS in `@layer components` using design tokens (CSS custom properties), compiled through Tailwind 4. Components use BEM-style class names (`btn`, `btn--primary`, `btn__icon`, `field__label`). `src/index.css` declares the layer order and imports the files in this order:

| File | Purpose |
| --- | --- |
| `theme.css` | Raw palette and font families, registered with `@theme static` so every variable is emitted (the styleguide reads them). |
| `tokens.css` | Semantic aliases (surfaces, text, accent, borders), spacing, radius, elevation, layout, motion and tracking scales. |
| `base.css` | Element defaults. |
| `components.css` | Component styles, plus the fluid type scale. |
| `layout.css` | Page shell and section styles. |

Components should use the semantic tokens in `tokens.css`, not the raw palette in `theme.css`.

### Container-query responsiveness

The `.page` wrapper is declared as a named inline-size container (`container: page / inline-size`). Responsive rules use `@container page (max-width: …)` instead of viewport media queries, with breakpoints at 64rem, 52rem and 40rem. This is what lets the styleguide's Mobile (375px) and Tablet (768px) frames behave exactly like a real device. The fluid gutter (`--gutter`) and section padding are also sized in `cqi` units against `.page`.

## Editing site content

Everything the visitor reads comes from [src/data/site.ts](src/data/site.ts):

| Export | Used for |
| --- | --- |
| `site` | Business name, descriptor, motto, service area, license, phone, `phoneHref`, email, hours, response time. |
| `navLinks` | Header navigation anchors. |
| `symptoms` | The "What's going on?" quick-pick chips in the hero. |
| `services` | The three service cards (HVAC, Electrical, Plumbing): title, description, bullet items, icon. |
| `processSteps` | The four-step "how it works" section. |
| `jobs` | Recent-work cards: photo, alt text, trade, town, title. |
| `tradeOptions` | Radio options in the quote form. |
| `footerColumns` | Footer link columns. |

Section anchors are `#hvac`, `#electrical`, `#plumbing`, `#work`, `#about` and `#quote`. Keep nav links and section `id` props in sync if you rename anything.

Photos are imported from [src/assets](src/assets) (`hvac.jpeg`, `electrical.jpeg`, `plumbing.jpeg`, `hero-bg.webp`). Swap the files or update the imports in `site.ts` and the Hero. Always update the `alt` text with the image.

Page-level copy that is not in `site.ts` (the hero headline, for example) is exposed as props with defaults, so you can override it without editing the component:

```tsx
<HomePage hero={{ headlineLead: 'Heat, power & water.', backgroundUrl: '' }} />
```

## Design system

### Colour

| Family | Role |
| --- | --- |
| **Ink** (950–100) | The dark neutrals the whole site sits on. |
| **Copper / Sand** | Brand metal: accents, gradients and warm surfaces. |
| **Navy** | Text on sand and copper surfaces. |
| **Flame** | The single call-to-action colour. It also marks electrical lines in the house diagram. |
| **Water** | Plumbing lines, footer headings and the focus ring. |

Semantic tokens include `--surface-deep|page|card|raised|sand`, `--border-subtle|strong`, `--text-primary|secondary|muted|accent|eyebrow|on-sand`, `--accent-cta` and `--focus-ring`.

### Typography

- **Barlow Condensed** (600–800) for display type.
- **Barlow** (400–600) for body.
- An eight-step fluid type scale defined in `components.css`.

### Spacing, shape and motion

- 4px-based spacing scale: `--space-1` (0.25rem) through `--space-24` (6rem).
- Radius: `xs` 2px, `sm` 4px, `md` 8px, `lg` 12px, `pill`.
- Elevation: `--shadow-card`, `--shadow-raised`.
- Layout: `--container` (75rem max), fluid `--gutter`, `--header-h`.
- Motion: `--ease-out`, `--ease-in-out`; durations `--duration-press` (160ms), `--duration-ui` (200ms), `--duration-image` (300ms).

## Styleguide

A small Storybook or Pattern Lab style viewer, served at **`/styleguide/`** (dev and production). It has `noindex` set, but it is still publicly reachable on any deployment that includes it.

Features:

- **Sidebar** with all patterns grouped as Foundations → Components → Layout → Pages, plus search.
- **Live variants** of each pattern in a resizable frame, with a code snippet per variant.
- **Props table** for each component.
- **Toolbar**: viewport (Mobile 375px, Tablet 768px, Desktop) and background surface (Auto, Dark, Sand, Light).
- **Hash routing** (`#/components/button`), so it works on any static host with no server rewrites.

| Group | Pages |
| --- | --- |
| Foundations | Colour (with verified text contrast), Typography, Spacing & shape, Motion, Icons |
| Components | Button, Text link, Eyebrow, Tag, Chip, Section heading, Checklist, Service card, Process step, Job card, Text field, Radio pills, Quote card, House diagram, Logo, Footer column |
| Layout | Container & Section, Topbar, Header, Hero, Services section, Process section, Work section, Quote section, Quote form, Footer, Layout shell |
| Pages | Home |

### Documenting a new component

1. Build the component in `src/components/` and export it (and its props type) from [src/components/index.ts](src/components/index.ts).
2. Add a specimen entry in [styleguide/specimen.tsx](styleguide/specimen.tsx) with an `id`, `group`, `title`, `summary`, `source`, variants (via the `story`, `row` or `custom` helpers) and a `props` table.
3. Run `npm run dev` and check it at `/styleguide/#/components/<id>`.

## Components reference

Components live in [src/components](src/components) and are imported from the barrel: `import { Button } from '../components'`. Full props and live examples are in the styleguide.

| Component | Purpose |
| --- | --- |
| `Button` | `variant`: primary, secondary, dark, ghost. `size`: sm, md, lg. Optional `icon` and `iconPosition`. Renders an `<a>` when `href` is set, otherwise a `<button>`. |
| `TextLink` | Inline text link. |
| `Eyebrow` | Small uppercase label above headings. |
| `Tag` | Static label. |
| `Chip` / `ChipRow` | Quick-pick pills. `ChipRow` takes a visible `label`, which also names the group for screen readers. |
| `SectionHeading` | Eyebrow, title and copy block for sections. |
| `Checklist` | Bulleted list with check icons. |
| `ServiceCard` | Trade card: index, category, icon, title, description, items and link. |
| `ProcessStep` | Numbered step. |
| `JobCard` | Recent-work card with photo, trade and town. |
| `TextField` / `TextArea` | Labelled inputs with `hint` and `error` states. They wire `aria-invalid` and `aria-describedby`. |
| `RadioPills` | Single-choice group on real radio inputs. |
| `QuoteCard` | Copper call-out with the emergency number and a jump link to the form. |
| `HouseDiagram` | Illustrated house with the three trades marked by colour. |
| `Logo` | Brand logo. `variant`: `full` (badge with ribbon) or `emblem` (house mark only), plus `size` in px. |
| `FooterColumn` | Titled list of footer links. |
| `Icon` | Font Awesome wrapper (`name`, `family`, `className`). |
| `cx` | Class-name joiner that ignores falsy values. |

## Layout reference

Layout components live in [src/layout](src/layout) and are imported from `src/layout`.

| Component | Purpose |
| --- | --- |
| `Layout` | Page shell: skip link, optional `Topbar` (prop `topbar`, default on), `Header`, `<main id="main">`, `Footer`, `MobileActionBar`. |
| `Container` | Centred, max-width content wrapper with the fluid gutter. |
| `Section` | Full-width band with a `tone` (`deep`, `page` or `sand`), an `id` for anchors and a `labelledBy` heading reference. |
| `Topbar` | Utility strip above the nav: emergency-service message, licence line and phone link. |
| `Header` | Logo and navigation. |
| `Hero` | Headline, copy, primary and secondary CTAs, symptom chips and a dimmed background photo. Every piece of text is a prop. |
| `ServicesSection` | The three trade cards. |
| `ProcessSection` | The four-step process. |
| `WorkSection` | Recent jobs. |
| `QuoteSection` | Copper `QuoteCard` bleeding off the left edge, paired with the `HouseDiagram`. |
| `QuoteForm` | The request form. |
| `Footer` | Footer columns and business details. |
| `MobileActionBar` | Fixed bottom Call / Free quote bar, shown only on narrow screens. |
| `HomePage` | Template that assembles all of the above. Accepts an optional `hero` prop. |

## Quote form

[QuoteForm](src/layout/QuoteForm.tsx) collects name, phone, trade (HVAC, Electrical, Plumbing or Not sure) and a free-text description. **It does not submit anywhere by default.** Submission is prevented, and it calls `onSubmit(formData)` only if you pass one:

```tsx
<QuoteForm
  onSubmit={async (data) => {
    await fetch('/api/quote', { method: 'POST', body: data })
  }}
/>
```

`HomePage` does not currently forward an `onSubmit` prop. To go live, either add one to `HomePage` or handle it inside `QuoteForm`. The static host must also have an endpoint to receive the data, such as a form service, serverless function or email API. Add validation, error and success states, and spam protection as part of that work.

## Accessibility

Built in:

- Skip link to `#main` and landmark structure (`<main>`, labelled sections).
- Real form controls: labelled inputs, native radio inputs behind the pills, and `aria-invalid` and `aria-describedby` on errors and hints.
- Visible focus ring (`--focus-ring`).
- Colour pairs checked on the styleguide's Colour page.
- Hover effects limited to `(hover: hover) and (pointer: fine)` devices.

Check these yourself before launch: the contrast of any new colours you add, alt text on replaced photos, and keyboard use of the quote form once it submits.

## Build and deployment

```bash
npm run build     # outputs dist/
npm run preview   # sanity-check the build locally
```

`dist/` holds both the site (`index.html`) and the styleguide (`styleguide/index.html`). It is static and can be hosted anywhere (Netlify, Vercel, Cloudflare Pages, Hostinger and so on). Notes:

- No server rewrites are needed, because the site is one page and the styleguide uses hash routing.
- To keep the styleguide off the public site, remove the `styleguide` entry from `build.rollupOptions.input` in [vite.config.ts](vite.config.ts) for production builds.
- Fonts and icons load from Google Fonts and cdnjs at runtime, so visitors need access to those hosts.
- Update the `<title>` in [index.html](index.html), and add a meta description, Open Graph tags and a real favicon in `public/` before launch.

## Linting and type checking

- `npm run lint` runs Oxlint with the `react`, `typescript` and `oxc` plugins. Enforced rules: `react/rules-of-hooks` (error) and `react/only-export-components` (warn).
- `npm run build` type-checks first (`tsc -b`) across `tsconfig.app.json` (app and styleguide) and `tsconfig.node.json` (Vite config).
- For stricter checks, add `oxlint-tsgolint` and set `"options": { "typeAware": true }` in [.oxlintrc.json](.oxlintrc.json).

## Conventions

- **Content lives in data.** Do not hard-code copy in layout components. Add it to `site.ts` or expose it as a prop with a default.
- **Components are content-agnostic.** They take props, so they can be documented in the styleguide with any content.
- **Tokens over raw values.** Use semantic tokens from `tokens.css`. Add a token before adding a one-off value.
- **Export through the barrels.** Export every component and its `…Props` type from `src/components/index.ts` or `src/layout/index.ts`.
- **Document in the styleguide.** A new or changed component should have a specimen entry.
- **Container queries, not media queries,** for layout responsiveness, so the styleguide viewport frames stay accurate.
- **Icons** are Font Awesome class names (for example `fa-fan`, `fa-bolt`, `fa-faucet-drip`), passed through the `Icon` component.
