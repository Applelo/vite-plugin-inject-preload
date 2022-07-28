import { resolve } from 'path'
import { build } from 'vite'
import { describe, expect, it } from 'vitest'
import type { OutputAsset, RollupOutput } from 'rollup'
import VitePluginInjectPreload from './../src/index'
import type { Options } from './../src/index'

const configs: Record<string, Options> = {
  injectBottom: {
    files: [
      {
        match: /Roboto-[a-zA-Z]*\.[a-z-0-9]*.woff2$/
      },
      {
        match: /lazy.[a-z-0-9]*.(css|js)$/
      }
    ],
    injectTo: 'head'
  },
  customAttributes: {
    files: [
      {
        match: /Roboto-[a-zA-Z]*\.[a-z-0-9]*.woff2$/,
        attributes: {
          as: 'font',
          crossorigin: 'anonymous',
          'data-font': 'Roboto'
        }
      }
    ]
  },
  auto: {
    files: [
      {
        match: /Roboto-[a-zA-Z]*\.[a-z-0-9]*.woff2$/
      },
      {
        match: /lazy.[a-z-0-9]*.(css|js)$/
      }
    ]
  }
}

const buildVite = async (config: Options) => {
  const { output } = (await build({
    root: resolve(__dirname, './../demo'),
    plugins: [VitePluginInjectPreload(config)]
  })) as RollupOutput

  const { source: indexSource } = output.find(
    item => item.fileName === 'index.html'
  ) as OutputAsset

  return indexSource.toString()
}

describe('excerpt', () => {
  for (const key in configs) {
    if (Object.prototype.hasOwnProperty.call(configs, key)) {
      const config = configs[key] as Options
      it(`test ${key}`, async () => {
        const output = await buildVite(config)
        expect(output).toMatchSnapshot()
      })
    }
  }
})
