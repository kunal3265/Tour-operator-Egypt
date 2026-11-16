import { cloudflare } from '@cloudflare/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  const offline = mode === 'offline'
  // Vercel serves the client on its own, with no Worker, so the Cloudflare
  // plugin is left out of that build and /api is answered in the browser.
  const serverlessHost = mode === 'vercel'
  return ({
  // The Sites build uses absolute asset URLs; `--mode offline` emits the same
  // bundle with relative URLs so it can run from a folder, no server needed.
  base: offline ? './' : '/',
  plugins: [react(), tailwindcss(), ...(serverlessHost ? [] : [cloudflare()])],
  server: { port: 5318, strictPort: false },
  // file:// cannot load ES modules, so the offline build is one classic script.
  ...(offline ? { build: { rollupOptions: { output: { format: 'iife' } } } } : {}),
  })
})
