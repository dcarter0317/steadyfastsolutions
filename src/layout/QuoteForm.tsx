import type { FormEvent } from 'react'
import { Button, RadioPills, SectionHeading, TextArea, TextField } from '../components'
import { tradeOptions } from '../data/site'
import { Section } from './Section'

export type QuoteFormProps = {
  eyebrow?: string
  title?: string
  copy?: string
  /** Called with the submitted fields. Without it the form does nothing, so wire this to your backend. */
  onSubmit?: (data: FormData) => void
}

/** “Tell us about the job” — intro on the left, request form on the right. */
export function QuoteForm({
  eyebrow = 'Request a quote',
  title = 'Tell us about the job',
  copy = 'A few details is all we need. We’ll call you back with an arrival window and a price range before any work starts.',
  onSubmit,
}: QuoteFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit?.(new FormData(event.currentTarget))
  }

  return (
    <Section tone="page" id="quote" labelledBy="quote-title">
      <div className="quote-form">
        <SectionHeading eyebrow={eyebrow} title={title} copy={copy} id="quote-title" />
        <form className="form-panel" onSubmit={handleSubmit}>
          <div className="form-panel__row">
            <TextField label="Name" name="name" autoComplete="name" required />
            <TextField label="Phone" name="phone" type="tel" autoComplete="tel" required />
          </div>
          <RadioPills legend="What do you need?" name="trade" options={tradeOptions} defaultValue="hvac" />
          <TextArea label="What’s going on?" name="details" />
          <div className="form-panel__footer">
            <p className="form-panel__note">No spam. We only call about your job.</p>
            <Button type="submit" size="lg">
              Get a free quote
            </Button>
          </div>
        </form>
      </div>
    </Section>
  )
}
