import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

const API_TARGET = 'https://contentplatform.runasp.net'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
  server: {
    proxy: {
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
        secure: true,
      },
      '/login': { target: API_TARGET, changeOrigin: true },
      '/register': { target: API_TARGET, changeOrigin: true },
      '/logout': { target: API_TARGET, changeOrigin: true },
      '/update-user-profile': { target: API_TARGET, changeOrigin: true },
      '/admin-test': { target: API_TARGET, changeOrigin: true },
      '/get-user-achievements': { target: API_TARGET, changeOrigin: true },
    },
  },
})