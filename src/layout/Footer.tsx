import { FooterColumn, Logo } from '../components'
import type { FooterColumnProps } from '../components'
import { footerColumns, site } from '../data/site'
import { Container } from './Container'

export type FooterProps = {
  columns?: FooterColumnProps[]
}

export function Footer({ columns = footerColumns }: FooterProps) {
  return (
    <footer className="site-footer" id="contact">
      <Container>
        <div className="site-footer__main">
          <div className="site-footer__brand">
            <Logo size={168} />
          </div>
          {columns.map((column) => (
            <FooterColumn key={column.title} {...column} />
          ))}
        </div>
        <div className="site-footer__legal">
          <p>
            © {site.name} · {site.descriptor}
          </p>
          <p>{site.license} · Licensed &amp; insured</p>
        </div>
      </Container>
    </footer>
  )
}
