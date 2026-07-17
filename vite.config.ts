import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.VITE_DEV_PROXY_TARGET || 'http://localhost:8080'

  return {
    plugins: [react()],
    server: {
      allowedHosts: ['localhost', '127.0.0.1', '.ngrok-free.app', '.trycloudflare.com'],
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
        },
        '/ws-chat': {
          target: proxyTarget,
          changeOrigin: true,
          ws: true,
        },
      },
    },
  }
})
