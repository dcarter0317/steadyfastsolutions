import { Button } from './Button'
import { Eyebrow } from './Eyebrow'

export type QuoteCardProps = {
  eyebrow?: string
  title: string
  copy: string
  emergencyLabel?: string
  phone: string
  phoneHref: string
  ctaLabel: string
  ctaHref: string
}

/** Copper call-out with the emergency number and a jump link to the form. */
export function QuoteCard({ eyebrow, title, copy, emergencyLabel, phone, phoneHref, ctaLabel, ctaHref }: QuoteCardProps) {
  return (
    <div className="quote-card">
      {eyebrow && <Eyebrow tone="sand">{eyebrow}</Eyebrow>}
      <h2 className="t-h2 quote-card__title">{title}</h2>
      <p className="quote-card__copy">{copy}</p>
      <hr className="quote-card__rule" />
      <div className="quote-card__emergency">
        {emergencyLabel && <Eyebrow tone="sand">{emergencyLabel}</Eyebrow>}
        <a className="quote-card__phone" href={phoneHref}>
          {phone}
        </a>
      </div>
      <Button variant="dark" href={ctaHref} icon="fa-arrow-down">
        {ctaLabel}
      </Button>
    </div>
  )
}
