import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({base:'/dex-terminal/',plugins:[react()],build:{outDir:'../../public/dex-terminal',emptyOutDir:true}})
