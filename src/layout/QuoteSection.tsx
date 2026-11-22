import { HouseDiagram, QuoteCard } from '../components'
import type { QuoteCardProps } from '../components'
import { site } from '../data/site'
import { Section } from './Section'

export type QuoteSectionProps = Partial<QuoteCardProps>

/** Copper call-out bleeding off the left edge, paired with the house diagram. */
export function QuoteSection({
  eyebrow = 'Free quote',
  title = 'Big or small, we do it all.',
  copy = `Tell us what’s going on. We’ll call back within ${site.responseTime} with a time and a price range.`,
  emergencyLabel = 'Emergency? Skip the form',
  phone = site.phone,
  phoneHref = site.phoneHref,
  ctaLabel = 'Request a quote online',
  ctaHref = '#quote',
}: QuoteSectionProps) {
  return (
    <Section contained={false} className="quote-section">
      <QuoteCard
        eyebrow={eyebrow}
        title={title}
        copy={copy}
        emergencyLabel={emergencyLabel}
        phone={phone}
        phoneHref={phoneHref}
        ctaLabel={ctaLabel}
        ctaHref={ctaHref}
      />
      <div className="quote-section__diagram">
        <HouseDiagram />
      </div>
    </Section>
  )
}
