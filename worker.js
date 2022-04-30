const fs = require('fs')

exports.runTest = async (testFile) => {
  const code = await fs.promises.readFile(testFile, 'utf8')

  return testFile + '\n' + code
}
