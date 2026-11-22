import { Icon } from './Icon'

const tradeIcons: Record<string, string> = {
  hvac: 'fa-fan',
  electrical: 'fa-bolt',
  plumbing: 'fa-faucet-drip',
}

export type JobCardProps = {
  /** Omit to show an icon placeholder until a real photo exists. */
  photoUrl?: string
  alt: string
  trade: string
  town: string
  title: string
}

export function JobCard({ photoUrl, alt, trade, town, title }: JobCardProps) {
  return (
    <article className="job-card">
      <div className="job-card__media">
        {photoUrl ? (
          <img src={photoUrl} alt={alt} loading="lazy" />
        ) : (
          <div className="job-card__placeholder" role="img" aria-label={alt}>
            <Icon name={tradeIcons[trade.toLowerCase()] ?? 'fa-screwdriver-wrench'} />
          </div>
        )}
      </div>
      <div>
        <p className="job-card__meta">
          {trade} · {town}
        </p>
        <h3 className="job-card__title t-h4">{title}</h3>
      </div>
    </article>
  )
}
