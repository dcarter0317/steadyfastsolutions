import { Icon } from './Icon'

export type ChecklistProps = { items: string[] }

export function Checklist({ items }: ChecklistProps) {
  return (
    <ul className="checklist list-reset">
      {items.map((item) => (
        <li className="checklist__item" key={item}>
          <Icon name="fa-check" className="checklist__icon" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
