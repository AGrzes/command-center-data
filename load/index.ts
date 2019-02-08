import * as debug from 'debug'
import { merge , override} from 'ouch-rx'
import { tap } from 'rxjs/operators'
import { db } from './pouchdb'
import { file } from './read'
import { yaml } from './yaml'
const log = debug('load')

db('progress-goal').then((pgdb) => file('data/progress-goal.yaml')
  .pipe(yaml(), merge(pgdb, override))
  .subscribe(log, log))
