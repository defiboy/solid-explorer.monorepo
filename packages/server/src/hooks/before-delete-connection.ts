// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'

import { IBlockchainSynchronizer } from '@solid-explorer/event-processor'

export default (options = {}): Hook => {
  return async (context: HookContext) => {
    console.log('Calling before delete connection hook')
    if (process.env.TESTING) {
      return context
    }
    const connectionId = context.id as number
    const blockchainSynchronizer: IBlockchainSynchronizer = context.app.get('blockchainSynchronizer')
    blockchainSynchronizer.stop(connectionId)
    return context
  }
}
