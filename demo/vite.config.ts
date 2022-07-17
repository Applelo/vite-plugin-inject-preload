import { defineConfig } from 'vite'
import VitePluginInjectPreload from './../src/index'
import Inspect from 'vite-plugin-inspect'

export default defineConfig({
  plugins: [
    VitePluginInjectPreload({
      files: [
        {
          match: /index\.[a-z-0-9]*.css$/,
          attributes: {
            as: 'style',
            type: 'text/css'
          }
        }
      ]
    }),
    Inspect()
  ]
})
