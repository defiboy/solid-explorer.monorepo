import { SequelizeServiceOptions, Service } from 'feathers-sequelize'

import { ContractDefinition } from '@solid-explorer/types'

import { Application } from '../../declarations'

export class ContractDefinitions extends Service<ContractDefinition> {
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options)
  }

  // create(data: ContractDefinition, params?: Params) {
  //   return super.create(data, params);
  // }
}
