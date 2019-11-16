import { Params } from 'express-serve-static-core'
import { SequelizeServiceOptions, Service } from 'feathers-sequelize'

import { Connection } from '@solid-explorer/types'

import { Application } from '../../declarations'

export class Connections extends Service<Connection> {
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options)
  }

  public create(data: Connection, params?: Params) {
    const connectionDataToInsert = {
      ...data,
      lastBlockNumberProcessed: 0
    }
    return super.create(connectionDataToInsert, params)
  }
}
