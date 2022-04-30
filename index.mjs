import Haste from 'jest-haste-map'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { cpus } from 'os'
import { Worker } from 'jest-worker'

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

const worker = new Worker(join(root, 'worker.js'), {
  enableWorkerThreads: true,
})

for await (const testFile of testFiles) {
  console.log(await worker.runTest(testFile))
}

worker.end()
