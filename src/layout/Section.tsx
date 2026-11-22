import type { ReactNode } from 'react'
import { cx } from '../components'
import { Container } from './Container'

export type SectionProps = {
  tone?: 'deep' | 'page' | 'sand'
  id?: string
  /** id of the heading that names this region. */
  labelledBy?: string
  /** Set false when the section manages its own full-bleed layout. */
  contained?: boolean
  className?: string
  children: ReactNode
}

/** Vertical rhythm + background for one page band. */
export function Section({ tone = 'deep', id, labelledBy, contained = true, className, children }: SectionProps) {
  return (
    <section className={cx('section', `section--${tone}`, className)} id={id} aria-labelledby={labelledBy}>
      {contained ? <Container>{children}</Container> : children}
    </section>
  )
}
