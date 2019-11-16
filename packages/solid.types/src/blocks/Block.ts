export interface BlockHeader {
  blockNumber: number // standard is "number" but typescript and tslint prohibit that...
  hash: string
  parentHash: string
  nonce: string
  sha3Uncles: string
  logsBloom: string
  transactionsRoot: string
  stateRoot: string
  miner: string
  extraData: string
  gasLimit: number
  gasUsed: number
  timestamp: number | string
  receiptsRoot: string
}

export interface Block extends BlockHeader {
  transactions: string[] // array with hash of transactions
  size: number
  difficulty: number
  totalDifficulty: number
  uncles: string[]
  connectionId: number // custom
}
