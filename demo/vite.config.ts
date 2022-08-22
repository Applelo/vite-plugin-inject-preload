import { resolve } from 'path'
import { defineConfig } from 'vite'
import VitePluginInjectPreload from '../src'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        page: resolve(__dirname, 'page.html')
      }
    }
  },
  plugins: [
    VitePluginInjectPreload({
      files: [
        {
          match: /Roboto-[a-zA-Z]*\.[a-z-0-9]*.woff2$/
        },
        {
          match: /lazy.[a-z-0-9]*.(css|js)$/
        }
      ],
      injectTo: 'custom'
    })
  ]
})
