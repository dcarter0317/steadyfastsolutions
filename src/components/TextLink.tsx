import type { ReactNode } from 'react'
import { cx } from './cx'
import { Icon } from './Icon'

export type TextLinkProps = {
  href: string
  tone?: 'copper' | 'light' | 'navy'
  /** Trailing icon. Pass `false` to remove it. */
  icon?: string | false
  className?: string
  children: ReactNode
}

export function TextLink({ href, tone = 'copper', icon = 'fa-arrow-right', className, children }: TextLinkProps) {
  return (
    <a className={cx('text-link', tone !== 'copper' && `text-link--${tone}`, className)} href={href}>
      <span>{children}</span>
      {icon && <Icon name={icon} className="text-link__icon" />}
    </a>
  )
}
