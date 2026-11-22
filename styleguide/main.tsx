import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/index.css'
import './css/styleguide.css'
import { Styleguide } from './styleguide.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Styleguide />
  </StrictMode>,
)
