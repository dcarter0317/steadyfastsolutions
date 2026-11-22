import { ProcessStep, SectionHeading } from '../components'
import type { ProcessStepProps } from '../components'
import { processSteps as defaultSteps } from '../data/site'
import { Section } from './Section'

export type ProcessSectionProps = {
  eyebrow?: string
  title?: string
  steps?: ProcessStepProps[]
}

/** Sand band with the four-step promise. */
export function ProcessSection({ eyebrow = 'How a job runs', title = 'What to expect on every job', steps = defaultSteps }: ProcessSectionProps) {
  return (
    <Section tone="sand" id="process" labelledBy="process-title">
      <div className="process">
        <SectionHeading tone="sand" eyebrow={eyebrow} title={title} id="process-title" />
        <hr className="process__rule" />
        <ol className="process__steps list-reset">
          {steps.map((step) => (
            <li key={step.step}>
              <ProcessStep {...step} />
            </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}
