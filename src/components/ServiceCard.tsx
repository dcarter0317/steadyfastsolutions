import { Checklist } from './Checklist'
import { Icon } from './Icon'
import { TextLink } from './TextLink'

export type ServiceCardProps = {
  /** Anchor id so the primary nav can link straight to the card. */
  id?: string
  /** Two-digit position, e.g. `01`. */
  index: string
  /** Band label, e.g. `Heating & cooling`. */
  category: string
  /** Font Awesome icon class for the band. */
  icon: string
  title: string
  description: string
  items: string[]
  href: string
  linkLabel: string
}

export function ServiceCard({ id, index, category, icon, title, description, items, href, linkLabel }: ServiceCardProps) {
  return (
    <article className="service-card" id={id}>
      <header className="service-card__band">
        <p className="service-card__category">
          {index} / {category}
        </p>
        <Icon name={icon} className="service-card__icon" />
      </header>
      <div className="service-card__body">
        <h3 className="t-h3">{title}</h3>
        <p className="service-card__desc">{description}</p>
        <hr className="service-card__rule" />
        <Checklist items={items} />
        <TextLink href={href}>{linkLabel}</TextLink>
      </div>
    </article>
  )
}
