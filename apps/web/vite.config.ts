import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '../../', '')
  const apiTarget = `http://localhost:${env.PORT || 3000}`
  const port = env.WEB_PORT ? Number(env.WEB_PORT) : undefined
  // comma-separated hostnames Vite should accept as Host header (needed behind a
  // custom domain in production, otherwise it replies "Blocked request")
  const allowedHosts = env.VITE_ALLOWED_HOSTS
    ? env.VITE_ALLOWED_HOSTS.split(',').map((host) => host.trim())
    : undefined
  // serves the Nest API under /s so the browser only ever talks to one origin
  // regex (not a plain prefix) so it matches /s and /s/... but not /src/*
  // needed by both the dev server and "vite preview" (production)
  const proxy = {
    '^/s(/|$)': {
      target: apiTarget,
      changeOrigin: true,
    },
  }

  return {
    plugins: [react(), tailwindcss()],
    // reads the monorepo's global .env at the repo root instead of apps/web
    envDir: '../../',
    server: {
      port,
      allowedHosts,
      proxy,
    },
    preview: {
      port,
      allowedHosts,
      proxy,
    },
  }
})
