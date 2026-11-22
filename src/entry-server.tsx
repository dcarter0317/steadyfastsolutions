import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.tsx'

export { buildLlmsTxt, buildStructuredData } from './seo/structuredData.ts'
export { seo } from './data/site.ts'

/** Used by scripts/prerender.mjs to bake the page into dist/index.html. */
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
