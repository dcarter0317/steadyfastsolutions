import { useId } from 'react'

export type RadioPillsProps = {
  legend: string
  name: string
  options: Array<{ value: string; label: string }>
  defaultValue?: string
}

/** Single-choice group styled as pills. Real radio inputs underneath, so keyboard and screen readers just work. */
export function RadioPills({ legend, name, options, defaultValue }: RadioPillsProps) {
  const groupId = useId()
  return (
    <fieldset className="radio-pills">
      <legend className="field__label radio-pills__legend">{legend}</legend>
      <div className="radio-pills__list">
        {options.map((option) => {
          const id = `${groupId}-${option.value}`
          return (
            <div className="radio-pill" key={option.value}>
              <input
                className="radio-pill__input"
                type="radio"
                id={id}
                name={name}
                value={option.value}
                defaultChecked={option.value === defaultValue}
              />
              <label className="radio-pill__label" htmlFor={id}>
                {option.label}
              </label>
            </div>
          )
        })}
      </div>
    </fieldset>
  )
}
