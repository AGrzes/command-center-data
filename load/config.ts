import {exists} from 'fs'
import {resolve,dirname} from 'path'
import {homedir} from 'os'
import { promisify } from 'util'
const existPromise = promisify(exists)
export function lookupConfig(name: string, startDir: string = process.cwd()): Promise<string[]> {
  startDir = resolve(startDir)
  const walk = (dir: string): string[] => {
    const parent = dirname(dir)
    if (parent === dir) {
      return [dir]
    } else {
      return [dir,...walk(parent)]
    }
  }
  const dirs = walk(startDir)
  const home = homedir()
  if (!dirs.includes(home)) {
    dirs.push(home)
  }
  return Promise.all(
    dirs.map((dir) => resolve(dir,name))
    .map((dir) => existPromise(dir).then((exist): string|boolean => exist? dir: false)))
    .then((dirs: Array<string|boolean>):string[] => dirs.filter((dir) => dir) as string[])
}
