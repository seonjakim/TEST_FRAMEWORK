const fs = require('fs')
const expect = require('expect')

exports.runTest = async (testFile) => {
  const code = await fs.promises.readFile(testFile, 'utf8')

  const testResult = {
    success: false,
    errorMessage: null,
  }
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

    const mock = {
      fn: (implementation) => {
        const mockFn = () => {
          mockFn.mock.calls.push([])
          implementation?.()
        }
        mockFn._isMockFunction = true
        mockFn.getMockName = () => 'mockFn'
        mockFn.mock = {}
        mockFn.mock.calls = []
        mockFn.mock.calls.count = () => mockFn.mock.calls.length
        return mockFn
      },
    }
    eval(code)
    testResult.success = true
  } catch (error) {
    testResult.errorMessage = error.message
  }
  return testResult
}
