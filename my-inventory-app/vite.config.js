import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // redirige /api hacia MockAPI
      '/api': {
        target: 'https://67890cb02c874e66b7d76623.mockapi.io/Api/V1/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
})
