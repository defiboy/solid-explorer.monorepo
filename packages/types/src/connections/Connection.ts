import { ConnectionType, PublicChainId } from './ConnectionType'

export interface Connection {
  id?: number
  name: string
  url: string
  lastBlockNumberProcessed?: number
  type?: ConnectionType
  publicChainId?: PublicChainId
}
