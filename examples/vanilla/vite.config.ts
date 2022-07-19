import { defineConfig } from 'vite'
import VitePluginInjectPreload from './../../src/index'
import Inspect from 'vite-plugin-inspect'

export default defineConfig({
  plugins: [
    VitePluginInjectPreload({
      files: [
        {
          match: /Roboto-[a-zA-Z]*\.[a-z-0-9]*.ttf$/
        },
        {
          match: /lazy.[a-z-0-9]*.(css|js)$/
        }
      ]
    }),
    Inspect()
  ]
})
