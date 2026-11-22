import { SectionHeading } from '../components'
import { faqs as defaultFaqs } from '../data/site'
import { Section } from './Section'

export type FaqSectionProps = {
  eyebrow?: string
  title?: string
  copy?: string
  faqs?: Array<{ question: string; answer: string }>
}

/** Questions as native <details>, so answers stay in the HTML for crawlers and work without JavaScript. */
export function FaqSection({
  eyebrow = 'Common questions',
  title = 'Straight answers before you call',
  copy = 'What people ask us most about pricing, scheduling and who does the work.',
  faqs = defaultFaqs,
}: FaqSectionProps) {
  return (
    <Section tone="page" id="faq" labelledBy="faq-title">
      <div className="faq">
        <SectionHeading eyebrow={eyebrow} title={title} copy={copy} id="faq-title" />
        <div className="faq__list">
          {faqs.map((item) => (
            <details className="faq__item" key={item.question}>
              <summary className="faq__question">
                <h3 className="t-h4">{item.question}</h3>
              </summary>
              <p className="faq__answer">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  )
}
