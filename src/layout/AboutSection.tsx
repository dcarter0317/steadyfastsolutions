import { SectionHeading } from '../components'
import { about as defaultAbout } from '../data/site'
import { Section } from './Section'

export type AboutSectionProps = {
  eyebrow?: string
  title?: string
  paragraphs?: string[]
  facts?: Array<{ term: string; detail: string }>
}

/** Who we are, in plain sentences, plus a fact list. This is the block search and answer engines quote. */
export function AboutSection({
  eyebrow = defaultAbout.eyebrow,
  title = defaultAbout.title,
  paragraphs = defaultAbout.paragraphs,
  facts = defaultAbout.facts,
}: AboutSectionProps) {
  return (
    <Section id="about" labelledBy="about-title">
      <div className="about">
        <div className="about__text">
          <SectionHeading eyebrow={eyebrow} title={title} id="about-title" />
          {paragraphs.map((paragraph) => (
            <p className="about__copy" key={paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
        <dl className="about__facts">
          {facts.map((fact) => (
            <div className="about__fact" key={fact.term}>
              <dt>{fact.term}</dt>
              <dd>{fact.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  )
}
