import type { CSSProperties } from 'react'
import heroBg from '../assets/hero-bg.webp'
import { Button, ChipRow, Logo, Tag } from '../components'
import { site, symptoms } from '../data/site'
import { Container } from './Container'

export type HeroProps = {
  tag?: string
  headlineLead?: string
  headlineAccent?: string
  copy?: string
  primaryCta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  symptomsLabel?: string
  symptoms?: Array<{ label: string; href: string }>
  /** Photo behind the hero, dimmed by an overlay for legibility. Defaults to the workshop shot; pass an empty string for a plain background. */
  backgroundUrl?: string
}

export function Hero({
  tag = 'HVAC · Electrical · Plumbing',
  headlineLead = 'Heat, power & water.',
  headlineAccent = 'One crew fixes all three.',
  copy = 'Furnace out, breaker tripping, pipe leaking? Call one number. We show up on time, quote before we start, and clean up when we’re done.',
  primaryCta = { label: 'Get a free quote', href: '#quote' },
  secondaryCta = { label: 'Call now', href: site.phoneHref },
  symptomsLabel = 'What’s going on?',
  symptoms: symptomChips = symptoms,
  backgroundUrl = heroBg,
}: HeroProps) {
  const style = backgroundUrl ? ({ '--hero-image': `url(${backgroundUrl})` } as CSSProperties) : undefined
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__bg" style={style} aria-hidden="true" />
      <Container>
        <div className="hero__inner">
          <div className="hero__logo">
            <Logo size={416} />
          </div>
          <div className="hero__content">
            <Tag>{tag}</Tag>
            <h1 className="t-display" id="hero-title">
              {headlineLead} <span className="hero__accent">{headlineAccent}</span>
            </h1>
            <p className="hero__copy">{copy}</p>
            <div className="hero__actions">
              <Button size="lg" href={primaryCta.href} icon="fa-arrow-right">
                {primaryCta.label}
              </Button>
              <Button size="lg" variant="secondary" href={secondaryCta.href} icon="fa-phone" iconPosition="start">
                {secondaryCta.label}
              </Button>
            </div>
          </div>
        </div>
        <div className="hero__symptoms">
          <ChipRow label={symptomsLabel} chips={symptomChips} />
        </div>
      </Container>
    </section>
  )
}
