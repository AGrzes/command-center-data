import {DbConfig} from './pouchdb'
export interface Config {
  couchdb: {
    [name: string]: DbConfig
  }
}
