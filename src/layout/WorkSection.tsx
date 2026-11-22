import { JobCard, SectionHeading, TextLink } from '../components'
import type { JobCardProps } from '../components'
import { jobs as defaultJobs } from '../data/site'
import { Section } from './Section'

export type WorkSectionProps = {
  eyebrow?: string
  title?: string
  jobs?: JobCardProps[]
  linkLabel?: string
  linkHref?: string
}

/** Heading row with a “see all” link, then a three-up grid of recent jobs. */
export function WorkSection({
  eyebrow = 'From the job site',
  title = 'Recent work',
  jobs = defaultJobs,
  linkLabel = 'See our work',
  linkHref = '#work',
}: WorkSectionProps) {
  return (
    <Section tone="page" id="work" labelledBy="work-title">
      <div className="work__head">
        <SectionHeading eyebrow={eyebrow} title={title} id="work-title" />
        <TextLink href={linkHref} tone="light">
          {linkLabel}
        </TextLink>
      </div>
      <div className="work__grid">
        {jobs.map((job) => (
          <JobCard key={job.title} {...job} />
        ))}
      </div>
    </Section>
  )
}
