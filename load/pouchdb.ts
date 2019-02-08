import * as _ from 'lodash'
import * as PouchHTTP from 'pouchdb-adapter-http'
import * as PouchDB from 'pouchdb-core'
import { loadConfig } from './config'
import { DbConfig } from './model/pouchdb'
PouchDB.plugin(PouchHTTP)

const databaseConfig = loadConfig()
  .then((configs) => _.assign({}, ..._(configs).reverse().map((config) => config.couchdb).value()))

const cache: {
  [name: string]: Promise<PouchDB.Database<any>>
} = {

}

export function db<T>(name: string): Promise<PouchDB.Database<T>> {
  if (!cache[name]) {
    cache[name] = databaseConfig.then((configs) => {
      if (configs[name]) {
        const config: DbConfig = configs[name]
        return Promise.resolve(new PouchDB(`${config.server.url}/${config.name}`))
      } else {
        return Promise.reject('Unknown Database')
      }
    })
  }
  return cache[name]
}
