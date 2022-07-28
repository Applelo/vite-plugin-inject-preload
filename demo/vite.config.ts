import VitePluginInjectPreload from '../src'

export default {
  plugins: [
    VitePluginInjectPreload({
      files: [
        {
          match: /Roboto-[a-zA-Z]*\.[a-z-0-9]*.woff2$/
        },
        {
          match: /lazy.[a-z-0-9]*.(css|js)$/
        }
      ]
    })
  ]
}
