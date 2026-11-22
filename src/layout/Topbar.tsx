import { site } from '../data/site'
import { Container } from './Container'

export type TopbarProps = {
  message?: string
  license?: string
  phone?: string
  phoneHref?: string
}

/** Thin utility strip above the nav: emergency promise, licence, phone. */
export function Topbar({
  message = `Same-day emergency service across ${site.serviceArea}`,
  license = `${site.license} · Licensed & insured`,
  phone = site.phone,
  phoneHref = site.phoneHref,
}: TopbarProps) {
  return (
    <div className="topbar">
      <Container className="topbar__inner">
        <p className="topbar__status">
          <span className="topbar__dot" aria-hidden="true" />
          {message}
        </p>
        <p className="topbar__meta">
          <span className="topbar__license">{license}</span>
          <span>
            Call{' '}
            <a className="topbar__call" href={phoneHref}>
              {phone}
            </a>
          </span>
        </p>
      </Container>
    </div>
  )
}
