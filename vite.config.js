import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import setupFeedbackApi from './server/api.js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'configure-server', 
      configureServer(server) {
        setupFeedbackApi(server.middlewares);
      }
    }
  ],
  server: {
    host: '0.0.0.0',
    allowedHosts: ['www.uniconnect.store', 'uniconnect-web-niey.onrender.com','https://uniconnect-web-fsm9.onrender.com', 'uniconnect-web-fsm9.onrender.com'],
  }
})
