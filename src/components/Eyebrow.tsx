import type { ReactNode } from 'react'
import { cx } from './cx'

export type EyebrowProps = {
  tone?: 'default' | 'sand'
  className?: string
  children: ReactNode
}

/** Small tracked label that sits above a heading. */
export function Eyebrow({ tone = 'default', className, children }: EyebrowProps) {
  return <p className={cx('eyebrow', tone === 'sand' && 'eyebrow--sand', className)}>{children}</p>
}
