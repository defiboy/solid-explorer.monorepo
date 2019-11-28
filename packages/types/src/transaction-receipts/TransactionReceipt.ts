export interface TransactionReceipt {
  id?: number
  status: boolean
  transactionHash: string // or hash
  transactionIndex: number //
  blockHash: string
  blockNumber: number
  from: string
  to: string | null
  contractAddress?: string | null // contractAddress?: string;
  cumulativeGasUsed: number
  gasUsed: number
  connectionId: number // custom
  // For future:
  //     logs: Log[];
  //     logsBloom: string;
  //     events?: {
  //         [eventName: string]: EventLog;
  //     };
}

export interface EventLog {
  event: string
  address: string
  returnValues: any
  logIndex: number
  transactionIndex: number
  transactionHash: string
  blockHash: string
  blockNumber: number
  raw?: { data: string; topics: any[] }
}

export interface Log {
  address: string
  data: string
  topics: Array<string | string[]>
  logIndex: number
  transactionIndex: number
  transactionHash: string
  blockHash: string
  blockNumber: number
}
