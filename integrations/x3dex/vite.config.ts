import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Root dotx3 builds keep the embedded route and output. The separate Vercel
// project opts into standalone explicitly, never through a shared VERCEL env var.
export default defineConfig(({ mode }) => {
  const standalone = mode === 'standalone'
  return {
    base: standalone ? '/' : '/dex-terminal/',
    plugins: [react()],
    build: {
      outDir: standalone ? 'dist' : '../../public/dex-terminal',
      emptyOutDir: true,
    },
  }
})
