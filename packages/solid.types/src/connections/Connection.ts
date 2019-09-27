export interface BlockProcessed {
  blockNumber: number
  transactionHash: string
  logIndex: number
}

export interface Connection {
  id?: number
  name: string
  url: string
  lastBlockProcessed?: BlockProcessed
}
