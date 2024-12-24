//Visitor Tracking Application

// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  base: "/dataexchangeip/",
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
})