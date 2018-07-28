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

const https = require('https')

const agent = new https.Agent({
  key: fs.readFileSync('/mnt/wgb/ca/secret.key'),
  cert: fs.readFileSync('/mnt/wgb/ca/secret.crt')
})

const db = new PouchDB('https://command-center.agrzes.pl:6984/reminders', {
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
