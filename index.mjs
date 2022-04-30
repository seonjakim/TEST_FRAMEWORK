import Haste from 'jest-haste-map'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { cpus } from 'os'

// this is __dirname in an .mjs file
const root = dirname(fileURLToPath(import.meta.url))
const hasteMap = new Haste.default({
  rootDir: root,
  roots: [root],
  maxWorker: cpus().length, // draw dependecy graph?
  platforms: [],
  extensions: ['js'],
  name: 'my-testing-framework', // cache name
})

const { hasteFS } = await hasteMap.build()

const testFiles = hasteFS.matchFilesWithGlob(['**/*.test.js'])

import fs from 'fs'

for await (const testFile of testFiles) {
  const code = await fs.promises.readFile(testFile, 'utf8')
  console.log(code)
}
