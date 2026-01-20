import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL?.includes('backend') ? 'http://backend:3000' : 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path,
        // If target is http://backend:3000 (Docker), we need to rewrite the origin
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log(`Proxying ${req.method} ${req.url} to ${proxyReq.protocol}//${proxyReq.host}`);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log(`Received ${proxyRes.statusCode} from ${req.url}`);
          });
          proxy.on('error', (err, req, _res) => {
            console.error(`Proxy error: ${err.message} for ${req.url}`);
          });
        },
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})