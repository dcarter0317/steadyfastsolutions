import type { ReactNode } from 'react'
import { Footer } from './Footer'
import { Header } from './Header'
import { MobileActionBar } from './MobileActionBar'
import { Topbar } from './Topbar'

export type LayoutProps = {
  /** Hide the utility strip on pages that don’t need it. */
  topbar?: boolean
  children: ReactNode
}

/** Page shell: skip link, topbar, nav, main landmark, footer. Also the container-query root for the whole design. */
export function Layout({ topbar = true, children }: LayoutProps) {
  return (
    <div className="page">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {topbar && <Topbar />}
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <MobileActionBar />
    </div>
  )
}
