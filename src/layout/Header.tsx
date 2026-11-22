import { useEffect, useState } from 'react'
import { Icon, Logo } from '../components'
import { navLinks, site } from '../data/site'
import { Container } from './Container'

export type HeaderProps = {
  links?: Array<{ label: string; href: string }>
  /** href of the link to mark as the current page. */
  currentHref?: string
}

/** Sticky primary navigation. On narrow screens it collapses to emblem + call button + menu toggle. */
export function Header({ links = navLinks, currentHref }: HeaderProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="site-header" data-open={open || undefined}>
      <Container>
        <nav className="site-nav" aria-label="Primary">
          <a className="site-nav__brand" href="#main" aria-label={`${site.name}, back to top`}>
            <Logo variant="emblem" size={56} alt="" />
            <span className="site-nav__brand-name">{site.name}</span>
          </a>
          <ul className="site-nav__list list-reset" id="site-nav-list">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  className="site-nav__link"
                  href={link.href}
                  aria-current={link.href === currentHref ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="site-nav__actions">
            <a className="site-nav__icon-btn site-nav__icon-btn--call" href={site.phoneHref} aria-label={`Call ${site.phone}`}>
              <Icon name="fa-phone" />
            </a>
            <button
              type="button"
              className="site-nav__icon-btn site-nav__toggle"
              aria-expanded={open}
              aria-controls="site-nav-list"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((value) => !value)}
            >
              <Icon name={open ? 'fa-xmark' : 'fa-bars'} />
            </button>
          </div>
        </nav>
      </Container>
    </header>
  )
}
