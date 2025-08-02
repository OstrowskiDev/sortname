#!/usr/bin/env node

const fs = require('fs').promises
const readline = require('readline')
const path = require('path')

const dirPath = process.cwd()

// creates question for CLI and returns user answer
async function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin, //read data from keyboard
    output: process.stdout, //display in CLI terminal
  })

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close()
      resolve(answer.trim().toLowerCase())
    })
  })
}

async function getFiles() {
  try {
    const files = await fs.readdir(dirPath, { withFileTypes: true })
    let data = []

    for (const file of files) {
      if (!file.isFile()) continue

      const fullPath = path.join(dirPath, file.name)
      const ext = path.extname(file.name)
      const baseName = path.basename(file.name, ext)
      const stats = await fs.stat(fullPath)
      const createdAt = stats.birthtime.getTime() // returns number in ms
      const fileData = {
        fullPath,
        ext,
        baseName,
        createdAt,
      }

      data.push(fileData)
    }

    return data
  } catch (error) {
    console.error('Error reading directory:', error)
    return []
  }
}

function sortFiles(files) {
  return files.sort((a, b) => a.createdAt - b.createdAt)
}

async function renameFiles(files) {
  let count = 1
  for (const file of files) {
    const newBaseName = createName(count)
    if (newBaseName === 'error') {
      throw new Error('Too many files in directory, sortname does not support more than 9999 files in single directory')
    }
    const oldName = path.join(dirPath, file.baseName + file.ext)
    const newName = path.join(dirPath, newBaseName + file.ext)
    await fs.rename(oldName, newName)
    count++
  }
}

function createName(number) {
  if (number > 9999) {
    return 'error'
  }
  if (number > 999) {
    return String(number).padStart(4, '0')
  }
  return String(number).padStart(3, '0')
}

async function main() {
  const answer = await askQuestion(`Are you sure you want to change filenames in: '${dirPath}' ? (y/n): `)

  if (answer !== 'y') {
    console.log(`sortname aborted by user`)
    process.exit(0)
  }

  const files = await getFiles()
  if (files.length === 0) {
    console.log('No files in directory')
    return
  }

  const sorted = sortFiles(files)

  try {
    await renameFiles(sorted)
    console.log('Files renamed successfully')
  } catch (err) {
    console.error(err.message)
  }
}

main()
