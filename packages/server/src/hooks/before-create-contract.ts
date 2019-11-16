// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers'
import { Contract } from '@solid-explorer/types'

export default (options = {}): Hook => {
  return async (context: HookContext) => {
    if (Array.isArray(context.data)) {
      const contracts = context.data as Contract[]
      const newData = contracts.map(item => {
        return {
          ...item,
          abi: item.abi.length === 0 ? '---' : JSON.stringify(context.data.abi)
        }
      })
      context.data = newData
    } else {
      const newData = {
        ...context.data,
        abi: JSON.stringify(context.data.abi)
      }
      context.data = newData
    }

    return context
  }
}
