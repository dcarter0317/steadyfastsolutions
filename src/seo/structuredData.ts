import { faqs, isPlaceholder, seo, services, site } from '../data/site'

const real = (value: string) => (isPlaceholder(value) ? undefined : value)

/** Phone number for schema.org, only once phoneHref is a real tel: link. */
const telephone = () => (site.phoneHref.startsWith('tel:') ? site.phoneHref.slice(4) : undefined)

/** JSON-LD graph: business entity, site, page and FAQ. Placeholder values are left out. */
export function buildStructuredData(siteUrl: string) {
  const base = siteUrl.replace(/\/$/, '')
  const businessId = `${base}/#business`
  const websiteId = `${base}/#website`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['GeneralContractor', 'HVACBusiness', 'Electrician', 'Plumber'],
        '@id': businessId,
        name: site.name,
        slogan: site.motto,
        description: seo.description,
        url: `${base}/`,
        logo: `${base}/steadfast-logo.svg`,
        image: `${base}/og-image.jpg`,
        telephone: telephone(),
        email: real(site.email),
        areaServed: real(site.serviceArea),
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: `${site.name} services`,
          itemListElement: services.map((service) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: service.title,
              description: service.description,
              serviceType: service.title,
              provider: { '@id': businessId },
            },
          })),
        },
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: `${base}/`,
        name: site.name,
        publisher: { '@id': businessId },
        inLanguage: 'en',
      },
      {
        '@type': 'WebPage',
        '@id': `${base}/#webpage`,
        url: `${base}/`,
        name: seo.title,
        description: seo.description,
        isPartOf: { '@id': websiteId },
        about: { '@id': businessId },
        inLanguage: 'en',
      },
      {
        '@type': 'FAQPage',
        '@id': `${base}/#faq`,
        mainEntity: faqs.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
    ],
  }
}

/** llms.txt: a short markdown brief for AI assistants and crawlers (llmstxt.org format). */
export function buildLlmsTxt(siteUrl: string) {
  const base = siteUrl.replace(/\/$/, '')
  const lines = [
    `# ${site.name}`,
    '',
    `> ${seo.description}`,
    '',
    `${site.name} is a general contracting and repair company for homes. One crew handles HVAC, electrical and plumbing. We quote before work starts and clean up afterwards. Tagline: "${site.motto}".`,
    '',
    '## Services',
    ...services.map((service) => `- [${service.title}](${base}/#${service.id}): ${service.description} Includes ${service.items.join('; ')}.`),
    '',
    '## Pages',
    `- [Home](${base}/): services, process, recent work and quote request`,
    `- [About](${base}/#about): who we are and how we work`,
    `- [FAQ](${base}/#faq): answers on pricing, quotes, emergencies and licensing`,
    `- [Request a quote](${base}/#quote): free quote form`,
    '',
    '## Facts',
    ...(real(site.serviceArea) ? [`- Service area: ${site.serviceArea}`] : []),
    ...(real(site.hours) ? [`- Hours: ${site.hours}`] : []),
    ...(real(site.phone) ? [`- Phone: ${site.phone}`] : []),
    ...(real(site.email) ? [`- Email: ${site.email}`] : []),
    '- Licensed and insured',
    '- Quotes are free and given before any work starts',
    '',
    '## FAQ',
    ...faqs.flatMap((item) => [`**${item.question}**`, item.answer, '']),
  ]
  return lines.join('\n').trimEnd() + '\n'
}
