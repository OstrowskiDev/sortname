const fs = require('fs').promises
// const path = require('path')

async function getFiles() {
  try {
    const dirPath = process.cwd()
    const files = await fs.readdir(dirPath)
    return files
  } catch (error) {
    console.error('Error reading directory:', error)
    return []
  }
}

async function main() {
  const files = await getFiles()

  //dalsze działania na files
}

main()
