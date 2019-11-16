import { Connection } from '@solid-explorer/types'

import { BlockData, MessageType } from './types'

export const stopAction = () => ({
  type: MessageType.Stop
})

export const startAction = (connection: Connection) => ({
  type: MessageType.Start,
  data: connection
})

export const pauseAction = () => ({
  type: MessageType.Pause
})

export const unPauseAction = (connection: Connection) => ({
  type: MessageType.Unpause,
  data: connection
})

export const resultAction = (blockData: BlockData) => ({
  type: MessageType.Result,
  data: blockData
})
