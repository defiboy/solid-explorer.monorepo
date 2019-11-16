import { Block, Connection, Contract, Transaction, TransactionReceipt, TransactionTrace } from '@solid-explorer/types'

export enum MessageType {
  Start = 'start',
  Stop = 'stop',
  Unpause = 'unpause',
  Pause = 'pause',
  Result = 'result'
}

export enum Status {
  NotStarted = 'NotStarted',
  Running = 'Running',
  Paused = 'Paused',
  Stopped = 'Stopped'
}

export interface ChildMessage {
  type: MessageType
  data: Connection
}

export interface ResultMessage {
  type: MessageType
  data: BlockData
}

export interface BlockData {
  transactionReceipts: TransactionReceipt[]
  transactions: Transaction[]
  block: Block
  contracts: Contract[]
  connection: Connection
  transactionTraces: TransactionTrace[]
}
