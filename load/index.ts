import * as debug from 'debug'
import { merge , override} from 'ouch-rx'
import { db } from './pouchdb'
import { file } from './read'
import { yaml } from './yaml'
const log = debug('load')

db('progress-goal').then((pgdb) => file('data/progress-goal.yaml')
  .pipe(yaml(), merge(pgdb, override))
  .subscribe(log, log))
db('command-center-config').then((cccdb) => file('data/command-center-config.yaml')
  .pipe(yaml(), merge(cccdb, override))
  .subscribe(log, log))
