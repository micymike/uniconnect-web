import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true,
    cors: {
      origin: '*',
    },
    allowedHosts: ['uniconnect-web-fsm9.onrender.com', 'www.uniconnect.store', 'uniconnect.store'],
  }
})
