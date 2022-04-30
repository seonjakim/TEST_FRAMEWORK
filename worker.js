const fs = require('fs')
const expect = require('expect')
const mock = require('jest-mock')
const { describe, it, run } = require('jest-circus')

exports.runTest = async (testFile) => {
  const code = await fs.promises.readFile(testFile, 'utf8')

  const testResult = {
    success: false,
    errorMessage: null,
  }
  // let testName = ''
  try {
    // can build expect like this below
    // const expect = (received) => ({
    //   toBe: (expected) => {
    //     if (received !== expected) {
    //       throw new Error(`Expected ${expected} but received ${received}`)
    //     }
    //   },
    // toThrow: () => {
    //   let hasThrow = false
    //   try {
    //     received()
    //   } catch (error) {
    //     hasThrow = true
    //   }
    //   if (!hasThrow) {
    //     throw new Error(`It did't throw.`)
    //   }
    // }
    // })

    // const mock = {
    //   fn: (implementation) => {
    //     const mockFn = () => {
    //       mockFn.mock.calls.push([])
    //       implementation?.()
    //     }
    //     mockFn._isMockFunction = true
    //     mockFn.getMockName = () => 'mockFn'
    //     mockFn.mock = {}
    //     mockFn.mock.calls = []
    //     mockFn.mock.calls.count = () => mockFn.mock.calls.length
    //     return mockFn
    //   },
    // }

    // const describeFns = []
    // let currentDescribeFn
    // const describe = (name, fn) => describeFns.push([name, fn])
    // const it = (name, fn) => currentDescribeFn.push([name, fn])
    eval(code)
    const { testResults } = await run()
    testResult.testResults = testResults
    testResult.success = testResults.every((result) => !result.errors.length)
    // for (const [name, fn] of describeFns) {
    //   currentDescribeFn = []
    //   testName = name
    //   fn()
    //   for (const [itName, itFn] of currentDescribeFn) {
    //     testName += ` + ${itName}`
    //     itFn()
    //   }
    // }
  } catch (error) {
    testResult.errorMessage = error.message
  }
  return testResult
}
