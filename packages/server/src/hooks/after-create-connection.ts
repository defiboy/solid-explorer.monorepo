// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'

import { IBlockchainSynchronizer } from '@solid-explorer/event-processor'
import { Connection } from '@solid-explorer/types'

export default (options = {}): Hook => {
  return async (context: HookContext) => {
    console.log('Running hook after create connection')
    if (process.env.TESTING) {
      return context
    }
    await startPolling(context)
    return context
  }
}

const startPolling = async (context: HookContext) => {
  try {
    const connection: Connection = context.result
    console.log('Starting to process blockchain')
    const blockchainSynchronizer: IBlockchainSynchronizer = context.app.get('blockchainSynchronizer')
    blockchainSynchronizer.startChildProcessFor(connection)
    Promise.resolve(true)
  } catch (error) {
    console.log('ERROR', error)
  }
}
