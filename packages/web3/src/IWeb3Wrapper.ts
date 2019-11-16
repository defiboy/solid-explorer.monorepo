import { ethers } from 'ethers'

import { Block, Transaction, TransactionReceipt, TransactionTrace } from '@solid-explorer/types'

export interface IWeb3Wrapper {
  provider: ethers.providers.JsonRpcProvider
  getBlockNumber: () => Promise<number>
  getTransactionReceipt: (txHash: string) => Promise<TransactionReceipt>
  getTransaction: (txHash: string) => Promise<Transaction>
  getBlock: (blockNumber: number) => Promise<Block>
  getCode: (contractAddress: string) => Promise<string>
  getTransactionCount: (contractAddress: string) => Promise<number>
  getTransactionTrace: (txHash: string) => Promise<TransactionTrace>
}
