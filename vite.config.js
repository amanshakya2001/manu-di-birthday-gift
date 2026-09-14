import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Tunnel hostnames Vite will answer to. A leading dot allows all subdomains.
// Without this, Vite rejects the ngrok Host header with "Blocked request".
const TUNNEL_HOSTS = ['.ngrok-free.app', '.ngrok.app', '.ngrok.io', '.trycloudflare.com']

export default defineConfig({
  plugins: [react()],
  // Relative base so the built site works from any folder, any host,
  // or even by opening dist/index.html over file://
  base: './',
  server: { allowedHosts: TUNNEL_HOSTS },
  preview: { allowedHosts: TUNNEL_HOSTS },
})
