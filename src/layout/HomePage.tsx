import type { HeroProps } from './Hero'
import { Hero } from './Hero'
import { Layout } from './Layout'
import { ProcessSection } from './ProcessSection'
import { QuoteForm } from './QuoteForm'
import { QuoteSection } from './QuoteSection'
import { ServicesSection } from './ServicesSection'
import { WorkSection } from './WorkSection'

export type HomePageProps = { hero?: HeroProps }

/** Landing-page template: every section in order, all content from src/data/site.ts. */
export function HomePage({ hero }: HomePageProps) {
  return (
    <Layout>
      <Hero {...hero} />
      <ServicesSection />
      <ProcessSection />
      <WorkSection />
      <QuoteSection />
      <QuoteForm />
    </Layout>
  )
}
