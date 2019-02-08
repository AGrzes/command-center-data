import {readFile} from 'fs'
import {bindNodeCallback, Observable} from 'rxjs'

const readFileRx: any = bindNodeCallback(readFile)

export function file(path: string, encoding: string = 'UTF-8'): Observable<string> {
  return readFileRx(path, encoding)
}
