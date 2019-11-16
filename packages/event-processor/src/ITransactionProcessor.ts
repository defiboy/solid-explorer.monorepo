import { Connection } from '@solid-explorer/types'

import { BlockData } from './types'

export interface ITransactionProcessor {
  processTransaction: (blockData: BlockData) => Promise<Connection>
}
