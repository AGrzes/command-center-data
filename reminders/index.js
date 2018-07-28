const {
  Ouch
} = require('ouch-rx')
const PouchDB = require('pouchdb-core').plugin(require('pouchdb-adapter-http'))
const yaml = require('js-yaml')
const fs = require('fs')
const rx = require('rxjs')
const {
  map,
  flatMap
} = require('rxjs/operators')
const path = require('path')
const fetch = require('node-fetch')
const readFileRx = rx.bindNodeCallback(fs.readFile)
const parameters = require('yargs')
  .option('db',{alias:'d',default:'https://command-center.agrzes.pl:6984/reminders'})
  .option('key',{alias:'k',default:'/mnt/wgb/ca/secret.key'})
  .option('cert',{alias:'c',default:'/mnt/wgb/ca/secret.crt'})
  .argv
const https = require('https')

const agent = new https.Agent({
  key: fs.readFileSync(parameters.key),
  cert: fs.readFileSync(parameters.cert)
})

const db = new PouchDB(parameters.db, {
  fetch(url, options) {
    return fetch(url, { ...options,
      agent
    })
  }
})

rx.bindNodeCallback(fs.readdir)(path.join(__dirname, 'data'))
  .pipe(
    flatMap((files) => rx.of(...files)),
    map((file) => path.join(__dirname, 'data', file)),
    flatMap((file) => readFileRx(file, 'UTF-8')),
    flatMap((content) => rx.of(...yaml.safeLoadAll(content))),
    new Ouch(db).merge((object, existing) => ({ ...object,
      _rev: existing ? existing._rev : undefined
    })))
  .subscribe(console.log, console.error)
