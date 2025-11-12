import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { apiPlugin } from './server/api-plugin.js'

export default defineConfig({
  plugins: [react(), apiPlugin()],
  // Load environment variables
  envDir: './',
})
