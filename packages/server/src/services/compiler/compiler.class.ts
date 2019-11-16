import { Params } from 'express-serve-static-core'

import { Id, ServiceMethods } from '@feathersjs/feathers'

interface CompilerRequest {
  sources: {}
  settings: {}
  language: 'Solidity'
}

interface CompilerResponse {
  data: string
}

export class CompilerService implements ServiceMethods<any> {
  public find(params?: Params): Promise<any> {
    console.log('FIND', (params as any).query)
    return Promise.resolve({
      data: 'somethig' // TODO
    })
  }

  public get(id: Id, params?: Params): Promise<CompilerResponse> {
    throw new Error('Method not implemented.')
  }

  public create(data: Partial<any> | Array<Partial<any>>, params?: Params): Promise<any> {
    throw new Error('Method not implemented.')
  }

  public update(id: Id, data: any, params?: Params): Promise<any> {
    throw new Error('Method not implemented.')
  }
  public patch(id: Id, data: Partial<any>, params?: Params): Promise<any> {
    throw new Error('Method not implemented.')
  }

  public remove(id: Id, params?: Params): Promise<any> {
    throw new Error('Method not implemented.')
  }
}
