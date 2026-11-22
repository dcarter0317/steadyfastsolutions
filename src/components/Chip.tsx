import { useId } from 'react'
import type { MouseEventHandler, ReactNode } from 'react'

export type ChipProps = {
  /** Renders an anchor instead of a toggle button. */
  href?: string
  selected?: boolean
  onClick?: MouseEventHandler<HTMLElement>
  children: ReactNode
}

export function Chip({ href, selected, onClick, children }: ChipProps) {
  if (href) {
    return (
      <a className="chip" href={href} onClick={onClick}>
        {children}
      </a>
    )
  }
  return (
    <button className="chip" type="button" aria-pressed={selected ?? false} onClick={onClick}>
      {children}
    </button>
  )
}

export type ChipRowProps = {
  label: string
  chips: Array<{ label: string; href: string }>
}

/** A labelled row of quick-pick chips (“What’s going on?”). */
export function ChipRow({ label, chips }: ChipRowProps) {
  const labelId = useId()
  return (
    <div className="chip-row" role="group" aria-labelledby={labelId}>
      <span className="chip-row__label" id={labelId}>
        {label}
      </span>
      {chips.map((chip) => (
        <Chip key={chip.label} href={chip.href}>
          {chip.label}
        </Chip>
      ))}
    </div>
  )
}
