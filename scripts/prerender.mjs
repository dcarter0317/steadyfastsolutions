// Post-build step: bakes the rendered page, SEO tags and crawler files into dist/.
// Set SITE_URL (e.g. https://www.example.com) so canonical, social and sitemap URLs are absolute.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { build } from 'vite'

const root = resolve(import.meta.dirname, '..')
const dist = resolve(root, 'dist')
const ssrDir = resolve(root, 'dist-ssr')
const siteUrl = (process.env.SITE_URL ?? '').replace(/\/$/, '')

if (!siteUrl) {
  console.warn('[prerender] SITE_URL is not set: skipping canonical, og:url, og:image, sitemap and absolute JSON-LD URLs.')
}

await build({
  root,
  logLevel: 'warn',
  build: { ssr: 'src/entry-server.tsx', outDir: ssrDir, emptyOutDir: true },
})

const mod = await import(pathToFileURL(resolve(ssrDir, 'entry-server.js')).href)
const html = await readFile(resolve(dist, 'index.html'), 'utf8')
const escapeAttr = (value) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')

const head = [
  `<meta property="og:description" content="${escapeAttr(mod.seo.description)}" />`,
  `<meta name="twitter:description" content="${escapeAttr(mod.seo.description)}" />`,
]
if (siteUrl) {
  head.push(
    `<link rel="canonical" href="${siteUrl}/" />`,
    `<meta property="og:url" content="${siteUrl}/" />`,
    `<meta property="og:image" content="${siteUrl}/og-image.jpg" />`,
    `<meta name="twitter:image" content="${siteUrl}/og-image.jpg" />`,
    `<link rel="alternate" type="text/plain" href="${siteUrl}/llms.txt" title="LLM-readable summary" />`,
    // "<" is escaped so no string in the data can close the script tag early.
    `<script type="application/ld+json">${JSON.stringify(mod.buildStructuredData(siteUrl)).replace(/</g, '\\u003c')}</script>`,
  )
}

const out = html.replace('<!--seo-head-->', head.join('\n    ')).replace('<!--app-html-->', mod.render())
if (out === html) throw new Error('[prerender] markers not found in dist/index.html')
await writeFile(resolve(dist, 'index.html'), out)

const aiBots = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended', 'CCBot']
const robots = [
  'User-agent: *',
  'Allow: /',
  'Disallow: /styleguide/',
  '',
  ...aiBots.flatMap((bot) => [`User-agent: ${bot}`, 'Allow: /', 'Disallow: /styleguide/', '']),
  ...(siteUrl ? [`Sitemap: ${siteUrl}/sitemap.xml`, ''] : []),
].join('\n')
await writeFile(resolve(dist, 'robots.txt'), robots)

if (siteUrl) {
  const lastmod = new Date().toISOString().slice(0, 10)
  await writeFile(
    resolve(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${siteUrl}/</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`,
  )
  await writeFile(resolve(dist, 'llms.txt'), mod.buildLlmsTxt(siteUrl))
}

await rm(ssrDir, { recursive: true, force: true })
await mkdir(dist, { recursive: true })
console.log(`[prerender] done${siteUrl ? ` for ${siteUrl}` : ' (no SITE_URL)'}`)
