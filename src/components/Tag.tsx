import type { ReactNode } from 'react'

export type TagProps = { children: ReactNode }

/** Outlined copper badge, e.g. the “HVAC · Electrical · Plumbing” kicker in the hero. */
export function Tag({ children }: TagProps) {
  return <span className="tag">{children}</span>
}
