import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// When deploying to GitHub Pages the repo name becomes the base path.
// Set VITE_BASE in your environment or just leave it as '/' for a custom domain.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/',
})
