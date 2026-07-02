import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '../../', '')
  const apiTarget = `http://localhost:${env.PORT || 3000}`

  return {
    plugins: [react(), tailwindcss()],
    // reads the monorepo's global .env at the repo root instead of apps/web
    envDir: '../../',
    server: {
      // serves the Nest API under /s so the browser only ever talks to one origin
      // regex (not a plain prefix) so it matches /s and /s/... but not /src/*
      proxy: {
        '^/s(/|$)': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
