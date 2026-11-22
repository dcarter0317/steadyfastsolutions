import { Icon } from '../components'
import { site } from '../data/site'

export type MobileActionBarProps = {
  callLabel?: string
  quoteLabel?: string
  quoteHref?: string
}

/** Fixed bottom call / quote bar. Only displayed on narrow screens (see layout.css). */
export function MobileActionBar({ callLabel = 'Call', quoteLabel = 'Free quote', quoteHref = '#quote' }: MobileActionBarProps) {
  return (
    <div className="action-bar">
      <a className="action-bar__btn action-bar__btn--call" href={site.phoneHref}>
        <Icon name="fa-phone" />
        <span>{callLabel}</span>
      </a>
      <a className="action-bar__btn action-bar__btn--quote" href={quoteHref}>
        <span>{quoteLabel}</span>
        <Icon name="fa-arrow-right" />
      </a>
    </div>
  )
}
