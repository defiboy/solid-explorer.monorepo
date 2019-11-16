import { BlockchainSynchronizer } from '@solidstudio/event-processor'

import { Application } from './declarations'
import { SequelizeTransactionProcessor } from './SequelizeTransactionProcessor'

export default function(app: Application) {
  const sequelizeTransactionProcessor = new SequelizeTransactionProcessor(app)
  const blockchainSynchronizer: BlockchainSynchronizer = new BlockchainSynchronizer(sequelizeTransactionProcessor)
  app.set('blockchainSynchronizer', blockchainSynchronizer)
}
