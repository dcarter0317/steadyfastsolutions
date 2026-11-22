import type { ReactNode } from 'react'
import { cx } from '../components'

export type ContainerProps = { className?: string; children: ReactNode }

/** Centered content column with fluid gutters. */
export function Container({ className, children }: ContainerProps) {
  return <div className={cx('container', className)}>{children}</div>
}
