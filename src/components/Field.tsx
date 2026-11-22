import { useId } from 'react'
import { cx } from './cx'

type FieldBase = {
  label: string
  name: string
  placeholder?: string
  required?: boolean
  defaultValue?: string
  hint?: string
  /** Error message. Switches the field to its error state. */
  error?: string
}

export type TextFieldProps = FieldBase & {
  type?: 'text' | 'tel' | 'email'
  autoComplete?: string
}

export function TextField({ label, name, type = 'text', placeholder, required, defaultValue, autoComplete, hint, error }: TextFieldProps) {
  const id = useId()
  const messageId = `${id}-message`
  const message = error ?? hint
  return (
    <div className={cx('field', error && 'field--error')}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <input
        className="input"
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
      />
      {message && (
        <p className="field__hint" id={messageId}>
          {message}
        </p>
      )}
    </div>
  )
}

export type TextAreaProps = FieldBase & { rows?: number }

export function TextArea({ label, name, rows = 5, placeholder, required, defaultValue, hint, error }: TextAreaProps) {
  const id = useId()
  const messageId = `${id}-message`
  const message = error ?? hint
  return (
    <div className={cx('field', error && 'field--error')}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <textarea
        className="textarea"
        id={id}
        name={name}
        rows={rows}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
      />
      {message && (
        <p className="field__hint" id={messageId}>
          {message}
        </p>
      )}
    </div>
  )
}
