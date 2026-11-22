import { cx } from './cx'

export type IconProps = {
  /** Font Awesome icon class, e.g. `fa-bolt`. */
  name: string
  family?: 'solid' | 'regular' | 'brands'
  className?: string
}

/** Decorative Font Awesome icon. Always hidden from assistive tech. */
export function Icon({ name, family = 'solid', className }: IconProps) {
  return <i className={cx(`fa-${family}`, name, className)} aria-hidden="true" />
}
