export interface Connection {
  id?: number
  name: string
  url: string
  lastBlockNumberProcessed?: number;
  lastTransactionHashProcessed?: string
  lastLogIndexProcessed?: number
}
