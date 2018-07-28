const { Ouch } = require('ouch-rx')
const yaml = require('js-yaml')
const fs = require('fs')
const rx = require('rxjs')
const {map,flatMap} = require('rxjs/operators')
const path = require('path')
const readFileRx = rx.bindNodeCallback(fs.readFile)


rx.bindNodeCallback(fs.readdir)(path.join(__dirname, 'data'))
  .pipe(
    flatMap((files) => rx.of(...files)),
    map((file)=>path.join(__dirname, 'data',file)),
    flatMap((file)=>readFileRx(file,'UTF-8')),
    flatMap((content)=>rx.of(...yaml.safeLoadAll(content))))
  .forEach(console.log)
