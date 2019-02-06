import {exists, readFile} from 'fs'
import {safeLoad} from 'js-yaml'
import {homedir} from 'os'
import {dirname, resolve} from 'path'
import { promisify } from 'util'
import {Config} from './model/config'
const existPromise = promisify(exists)
const readFilePromise = promisify(readFile)
export function lookupConfig(name: string, startDir: string = process.cwd()): Promise<string[]> {
  startDir = resolve(startDir)
  const walk = (dir: string): string[] => {
    const parent = dirname(dir)
    if (parent === dir) {
      return [dir]
    } else {
      return [dir, ...walk(parent)]
    }
  }
  const dirs = walk(startDir)
  const home = homedir()
  if (!dirs.includes(home)) {
    dirs.push(home)
  }
  return Promise.all(
    dirs.map((dir) => resolve(dir, name))
    .map((dir) => existPromise(dir).then((exist): string|boolean => exist ? dir : false)))
    .then((existingDirs: Array<string|boolean>): string[] => existingDirs.filter((dir) => dir) as string[])
}

export function loadConfig(startDir: string = process.cwd()): Promise<Config[]> {
  return lookupConfig('.yellow/config.yaml', startDir)
    .then((files) => Promise.all(files.map((file) => readFilePromise(file, 'UTF-8').then(safeLoad) )))
}
