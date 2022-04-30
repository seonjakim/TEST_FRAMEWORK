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
    // })
    eval(code)
    testResult.success = true
  } catch (error) {
    testResult.errorMessage = error.message
  }
  return testResult
}
