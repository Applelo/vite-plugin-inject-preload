[![npm](https://img.shields.io/npm/v/vite-plugin-inject-preload)](https://github.com/Applelo/vite-plugin-inject-preload) [![node-current](https://img.shields.io/node/v/vite-plugin-inject-preload)](https://nodejs.org/)


# vite-plugin-inject-preload
A [Vite plugin](https://github.com/vitejs/vite) for injecting [&lt;link rel='preload'>](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content)


This plugin adds preload links on build by getting ViteJS output assets.

Currently this plugin **only works on build** because of the way Vite behave. Maybe in a future update 🤷‍♂️.

## 📦 Install


```
npm i -D vite-plugin-inject-preload

# yarn
yarn add -D vite-plugin-inject-preload

# pnpm
pnpm add -D vite-plugin-inject-preload
```

## 👨‍💻 Usage

```js
// vite.config.js / vite.config.ts
import VitePluginInjectPreload from 'vite-plugin-inject-preload'

export default {
  plugins: [
    VitePluginInjectPreload({
      files: [
        {
          match: /Roboto-[a-zA-Z]*\.[a-z-0-9]*.woff2$/
        },
        {
          match: /lazy.[a-z-0-9]*.(css|js)$/,
        }
      ]
    })
  ]
}
```

**Options**

* files: An array of files object
  * match: A regular expression to target build files you want to preload
  * attributes (optional):
  If this option is ommited, it will determine the `mime` and the `as` attributes automatically.
  You can also add/override any attributes you want (but not the `rel="preload"` attribute).
* injectTo (optional): By default, the preload links are injected with the `'head-prepend'` options. But you can pass `'head'` to inject preload links at bottom of the head tag if you need it.

With the full options usage, you can do something like this :

```js
// vite.config.js / vite.config.ts
import VitePluginInjectPreload from 'vite-plugin-inject-preload'

export default {
  plugins: [
    VitePluginInjectPreload({
      files: [
        {
          match: /Roboto-[a-zA-Z]*\.[a-z-0-9]*.woff2$/,
          attributes: {
            type: 'font/woff2',
            as: 'font',
            crossorigin: 'anonymous',
            'data-font': 'Roboto'
          }
        }
      ],
      injectTo: 'head-prepend'
    })
  ]
}
```

## 👨‍💼 Licence

GPL-3.0