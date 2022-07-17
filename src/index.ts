import type { Plugin, HtmlTagDescriptor } from 'vite'
import mime from 'mime-types'

interface OptionsFiles {
  match: RegExp
  attributes?: Record<string, string>
}

interface Options {
  files: OptionsFiles[]
  injectTo?: 'head' | 'head-prepend'
}

export default function VitePluginInjectPreload(options: Options): Plugin {
  return <Plugin>{
    name: 'vite-plugin-inject-preload',
    transformIndexHtml: {
      enforce: 'post',
      transform(html, ctx) {
        const bundle = ctx.bundle
        if (!bundle) return html

        const tags: HtmlTagDescriptor[] = []

        for (const asset in bundle) {
          for (let index = 0; index < options.files.length; index++) {
            const file = options.files[index]
            const attrs = file.attributes || {}
            if (file.match.test(asset)) {
              let href = attrs.href ? attrs.href : false
              if (href === false || typeof href === 'undefined') {
                href = '/' + asset
              }

              tags.push({
                tag: 'link',
                attrs: Object.assign(
                  {
                    rel: 'preload',
                    href,
                    type: mime.lookup(asset),
                    as: 'style' as RequestDestination //https://fetch.spec.whatwg.org/#concept-request-destination
                  },
                  attrs
                ),
                injectTo: options.injectTo ? options.injectTo : 'head'
              })
            }
          }
        }

        return tags
      }
    }
  }
}
