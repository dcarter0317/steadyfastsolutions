export type ProcessStepProps = {
  step: number | string
  title: string
  description: string
}

/** One numbered step. Wrap in `<li>` inside an `<ol>` when listing several. */
export function ProcessStep({ step, title, description }: ProcessStepProps) {
  return (
    <div className="process-step">
      <p className="process-step__num" aria-hidden="true">
        {step}
      </p>
      <h3 className="t-h4 process-step__title">{title}</h3>
      <p className="process-step__desc">{description}</p>
    </div>
  )
}
