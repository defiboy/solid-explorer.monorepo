import { SequelizeServiceOptions, Service } from 'feathers-sequelize'

import { Contract } from '@solidstudio/types'

import { Application } from '../../declarations'

export class Contracts extends Service<Contract> {
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options)
  }
  // create(data: Contract, params?: Params) {
  //   return super.create(data, params);
  // }
}
