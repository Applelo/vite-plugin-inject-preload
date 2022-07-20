import { build } from 'vite'
import VitePluginInjectPreload, { Options } from './../src/index'
import { describe, expect, it } from 'vitest'
import { resolve } from 'path'
import type { RollupOutput, OutputAsset } from 'rollup'

const configs = {
  injectBottom: {
    files: [
      {
        match: /Roboto-[a-zA-Z]*\.[a-z-0-9]*.ttf$/
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
        match: /Roboto-[a-zA-Z]*\.[a-z-0-9]*.ttf$/,
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
        match: /Roboto-[a-zA-Z]*\.[a-z-0-9]*.ttf$/
      },
      {
        match: /lazy.[a-z-0-9]*.(css|js)$/
      }
    ]
  }
}

const buildVite = async (config: any) => {
  const { output } = (await build({
    root: resolve(__dirname, './project'),
    plugins: [VitePluginInjectPreload(config)]
  })) as RollupOutput

  const { source: indexSource } = output.find(
    item => item.fileName === 'index.html'
  ) as OutputAsset

  return indexSource.toString()
}

describe('excerpt', async () => {
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
