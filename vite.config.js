import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Importe o módulo 'path' do Node.js

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/ProUni_Front/", // Substitua "ProUni_Front" pelo nome do seu repositório no GitHub
  build: {
    outDir: 'docs' // Altera a pasta de saída de 'dist' para 'docs'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
