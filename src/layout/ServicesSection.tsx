import { SectionHeading, ServiceCard } from '../components'
import type { ServiceCardProps } from '../components'
import { services as defaultServices } from '../data/site'
import { Section } from './Section'

export type ServicesSectionProps = {
  eyebrow?: string
  title?: string
  copy?: string
  services?: ServiceCardProps[]
}

/** Two-column split: intro on the left, stacked service cards on the right. */
export function ServicesSection({
  eyebrow = 'Three trades, one call',
  title = 'The systems that keep a house running',
  copy = 'Most jobs touch more than one trade. A new furnace needs a circuit; a water heater needs gas, power and pipe. We handle the whole job.',
  services = defaultServices,
}: ServicesSectionProps) {
  return (
    <Section id="services" labelledBy="services-title">
      <div className="services">
        <SectionHeading eyebrow={eyebrow} title={title} copy={copy} id="services-title" />
        <div className="services__list">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </Section>
  )
}
