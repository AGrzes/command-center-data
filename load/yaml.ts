import {safeLoad, safeLoadAll} from 'js-yaml'
import { Observable, of, OperatorFunction } from 'rxjs'
import { flatMap } from 'rxjs/operators'

export const yaml: () => OperatorFunction<string, object[]> = () =>
  (source: Observable<string>) => source.pipe(flatMap((content) => {
    if (content.startsWith('---\n')) {
      return of(...safeLoadAll(content))
    } else {
      return of(safeLoad(content))
    }
  }))
