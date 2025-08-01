#!/usr/bin/env node

const fs = require('fs').promises
const readline = require('readline')
// const path = require('path')

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
    const files = await fs.readdir(dirPath)
    return files
  } catch (error) {
    console.error('Error reading directory:', error)
    return []
  }
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

  console.log('Files found in directory:', files)
  //dalsze działania na files
}

main()
