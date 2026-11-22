import type { MouseEventHandler, ReactNode } from 'react'
import { cx } from './cx'
import { Icon } from './Icon'

export type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'dark' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  /** Font Awesome icon class. */
  icon?: string
  iconPosition?: 'start' | 'end'
  /** Renders an anchor instead of a button. */
  href?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  className?: string
  onClick?: MouseEventHandler<HTMLElement>
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'end',
  href,
  type = 'button',
  disabled,
  className,
  onClick,
  children,
}: ButtonProps) {
  const classes = cx('btn', `btn--${variant}`, size !== 'md' && `btn--${size}`, className)
  const content = (
    <>
      {icon && iconPosition === 'start' && <Icon name={icon} className="btn__icon" />}
      <span>{children}</span>
      {icon && iconPosition === 'end' && <Icon name={icon} className="btn__icon" />}
    </>
  )

  if (href) {
    return (
      <a className={classes} href={href} aria-disabled={disabled || undefined} onClick={onClick}>
        {content}
      </a>
    )
  }

  return (
    <button className={classes} type={type} disabled={disabled} onClick={onClick}>
      {content}
    </button>
  )
}
