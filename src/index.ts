import type { Plugin, HtmlTagDescriptor } from 'vite'
import mime from 'mime-types'

interface OptionsFilesAttributes {
  /*
    @see https://fetch.spec.whatwg.org/#concept-request-destination
  */
  as: RequestDestination
  [key: string]: string
}

interface OptionsFiles {
  match: RegExp
  attributes?: OptionsFilesAttributes
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
            if (!file.match.test(asset)) continue

            const attrs = file.attributes || ({} as OptionsFilesAttributes)
            const type = mime.lookup(asset)
            const injectTo = options.injectTo
              ? options.injectTo
              : 'head-prepend'
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
                  type: type ? type : undefined,
                  as: type ? getAsWithMime(type) : undefined
                },
                attrs
              ),
              injectTo
            })
          }
        }

        return tags
      }
    }
  }
}

const getAsWithMime = (mime: string) => {
  let as = mime.split('/')[0]

  if (['text/css'].includes(mime)) {
    as = 'style'
  } else if (['application/javascript'].includes(mime)) {
    as = 'script'
  } else if (['text/vtt'].includes(mime)) {
    as = 'track'
  }

  return as
}
