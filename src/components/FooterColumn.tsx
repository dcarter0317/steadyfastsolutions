import { useId } from 'react'
import { cx } from './cx'

export type FooterLink = {
  label: string
  /** Omit for plain text (hours, email placeholder…). */
  href?: string
  /** Bolder, brighter text — used for the phone number. */
  strong?: boolean
}

export type FooterColumnProps = {
  title: string
  links: FooterLink[]
}

export function FooterColumn({ title, links }: FooterColumnProps) {
  const titleId = useId()
  return (
    <nav className="footer-col" aria-labelledby={titleId}>
      <h3 className="footer-col__title" id={titleId}>
        {title}
      </h3>
      <ul className="footer-col__list list-reset">
        {links.map((link) => {
          const className = cx('footer-col__item', link.strong && 'footer-col__item--strong')
          return (
            <li key={link.label}>
              {link.href ? (
                <a className={className} href={link.href}>
                  {link.label}
                </a>
              ) : (
                <span className={className}>{link.label}</span>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
