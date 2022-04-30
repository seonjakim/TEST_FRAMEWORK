import Haste from 'jest-haste-map'
import { dirname, join, relative } from 'path'
import { fileURLToPath } from 'url'
import { cpus } from 'os'
import { Worker } from 'jest-worker'
import chalk from 'chalk'

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
let hasFailed = false
for await (const testFile of testFiles) {
  const { success, errorMessage } = await worker.runTest(testFile)
  const status = success
    ? chalk.green.inverse(' PASS ')
    : chalk.red.inverse(' FAIL ')
  console.log(status + ' ' + chalk.dim(relative(testFile)))
  if (!success) {
    hasFailed = true
    console.log(errorMessage)
  }
}

worker.end()

if (hasFailed) {
  console.log(chalk.red.bold(`the test run failed`))
  process.exitCode = 1
}
