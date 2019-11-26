export interface Transaction {
  id: number
  hash: string
  nonce: number
  blockHash: string | null
  blockNumber: number | null
  transactionIndex: number | null
  from: string
  to: string | null
  value: string
  gasPrice: string
  gas: number
  input: string
  connectionId: number // custom
}
