import type { ReactNode } from 'react'
import { cx } from './cx'
import { Eyebrow } from './Eyebrow'

export type SectionHeadingProps = {
  eyebrow?: string
  title: string
  copy?: ReactNode
  tone?: 'dark' | 'sand'
  /** Heading level. Visual size is the same for all levels. */
  as?: 'h1' | 'h2' | 'h3'
  id?: string
}

export function SectionHeading({ eyebrow, title, copy, tone = 'dark', as: Heading = 'h2', id }: SectionHeadingProps) {
  return (
    <div className={cx('section-heading', tone === 'sand' && 'section-heading--sand')}>
      {eyebrow && <Eyebrow tone={tone === 'sand' ? 'sand' : 'default'}>{eyebrow}</Eyebrow>}
      <Heading className="t-h2" id={id}>
        {title}
      </Heading>
      {copy && <p className="t-lead section-heading__copy">{copy}</p>}
    </div>
  )
}
