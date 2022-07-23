import type { HtmlTagDescriptor, Plugin } from 'vite'
import { OutputBundle } from 'rollup'
import mime from 'mime-types'

export interface OptionsFiles {
  /**
   * Regular expression to target build files
   */
  match: RegExp
  /**
   * Attributes added to the preload links
   */
  attributes?: Record<string, string>
}

export interface Options {
  /**
   * An array of file options
   */
  files: OptionsFiles[]
  /**
   * The position where the preload links are injected
   */
  injectTo?: 'head' | 'head-prepend'
}

export default function VitePluginInjectPreload(options: Options): Plugin {
  return {
    name: 'vite-plugin-inject-preload',
    transformIndexHtml: {
      enforce: 'post',
      transform(html, ctx) {
        const bundle = ctx.bundle
        if (!bundle) return html

        const tags: HtmlTagDescriptor[] = []

        const assets: OutputBundle = Object.keys(bundle)
          .sort()
          .reduce((res, key) => ((res[key] = bundle[key]), res), {})

        for (const asset in assets) {
          for (let index = 0; index < options.files.length; index++) {
            const file = options.files[index]
            if (!file.match.test(asset)) continue

            const attrs = file.attributes || ({} as Record<string, string>)
            const injectTo = options.injectTo
              ? options.injectTo
              : 'head-prepend'
            let href = attrs.href ? attrs.href : false
            if (href === false || typeof href === 'undefined') {
              href = `/${asset}`
            }
            const type = attrs.type ? attrs.type : mime.lookup(asset)
            const as = attrs.as ? attrs.as : getAsWithMime(type || '')

            tags.push({
              tag: 'link',
              attrs: Object.assign(
                {
                  rel: 'preload',
                  href,
                  type: type || undefined,
                  as
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

export const getAsWithMime = (mime: string): RequestDestination | undefined => {
  let destination = mime.split('/')[0]
  const validDestinations = [
    'audio',
    'audioworklet',
    'document',
    'embed',
    'font',
    'frame',
    'iframe',
    'image',
    'manifest',
    'object',
    'paintworklet',
    'report',
    'script',
    'sharedworker',
    'style',
    'track',
    'video',
    'worker',
    'xslt'
  ]

  if (['text/css'].includes(mime)) destination = 'style'
  else if (['application/javascript'].includes(mime)) destination = 'script'
  else if (['text/vtt'].includes(mime)) destination = 'track'

  return validDestinations.includes(destination)
    ? (destination as RequestDestination)
    : undefined
}
