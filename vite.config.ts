import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Deployed in a subfolder (e.g. /steadfast/); set VITE_BASE at build time. Defaults to root for local dev.
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      // Two entries: the site, and the styleguide at /styleguide/.
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        styleguide: resolve(import.meta.dirname, 'styleguide/index.html'),
      },
    },
  },
})
