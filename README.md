[![npm](https://img.shields.io/npm/v/vite-plugin-inject-preload)](https://www.npmjs.com/package/vite-plugin-inject-preload) [![node-current](https://img.shields.io/node/v/vite-plugin-inject-preload)](https://nodejs.org/) [![Coverage Status](https://coveralls.io/repos/github/Applelo/vite-plugin-inject-preload/badge.svg?branch=main)](https://coveralls.io/github/Applelo/vite-plugin-inject-preload?branch=main)


# vite-plugin-inject-preload

A [Vite plugin](https://github.com/vitejs/vite) for injecting [&lt;link rel='preload'>](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content)

This plugin adds preload links on build by getting ViteJS output assets.

Supporting Vite 3 and 4.

 > Currently, this plugin **only works on build** because of [the way Vite behave](https://github.com/Applelo/vite-plugin-inject-preload/issues/15).

## 📦 Install

```
npm i -D vite-plugin-inject-preload

# yarn
yarn add -D vite-plugin-inject-preload

# pnpm
pnpm add -D vite-plugin-inject-preload
```

## 👨‍💻 Usage

All the files needs to be process by ViteJS to be find by the plugin. For example, if I load this CSS file :

```css
@font-face {
  font-family: 'Roboto';
  src: url('./../fonts/Roboto-Italic.woff2');
  font-weight: 400;
  font-style: italic;
}

@font-face {
  font-family: 'Roboto';
  src: url('./../fonts/Roboto-Regular.woff2');
  font-weight: 400;
  font-style: normal;
}
```

I can make the following configuration for VitePluginInjectPreload :

```js
// vite.config.js / vite.config.ts
import VitePluginInjectPreload from 'vite-plugin-inject-preload'

export default {
  plugins: [
    VitePluginInjectPreload({
      files: [
        {
          match: /Roboto-[a-zA-Z]*-[a-z-0-9]*\.woff2$/
        },
        {
          match: /lazy.[a-z-0-9]*.(css|js)$/,
        }
      ]
    })
  ]
}
```

For the full example, check the demo folder available [here](https://github.com/Applelo/vite-plugin-inject-preload/tree/main/demo).

### Options

* files: An array of files object
  * match: A regular expression to target build files you want to preload
  * attributes (optional):
  If this option is ommited, it will determine the `mime` and the `as` attributes automatically.
  You can also add/override any attributes you want.
* injectTo (optional): By default, the preload links are injected with the `'head-prepend'` options. But you can pass `'head'` to inject preload links at bottom of the head tag if you need it.<br> Since 1.1, you can pass the `'custom'` option and put `<!--__vite-plugin-inject-preload__-->` in your `.html` file where you want to inject the preload links.

With the full options usage, you can do something like this :

```js
// vite.config.js / vite.config.ts
import VitePluginInjectPreload from 'vite-plugin-inject-preload'

export default {
  plugins: [
    VitePluginInjectPreload({
      files: [
        {
          match: /Roboto-[a-zA-Z]*-[a-z-0-9]*\.woff2$/,
          attributes: {
            'type': 'font/woff2',
            'as': 'font',
            'crossorigin': 'anonymous',
            'data-font': 'Roboto'
          }
        },
        {
          match: /lazy.[a-z-0-9]*.(js)$/,
          attributes: {
            rel: 'modulepreload',
            type: undefined,
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
