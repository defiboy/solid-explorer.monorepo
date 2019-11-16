import { ethers } from 'ethers'

import { Block, Transaction, TransactionReceipt, TransactionTrace } from '@solid-explorer/types'

import { Network } from 'ethers/utils'
import { IWeb3Wrapper } from './IWeb3Wrapper'

// https://github.com/ethereum/wiki/wiki/JSON-RPC
export class Web3Wrapper implements IWeb3Wrapper {
  public provider: any // ethers.providers.JsonRpcProvider

  constructor(blockchainUrl: string, chainId?: string | number | Network | undefined) {
    const url = blockchainUrl
    this.provider = new ethers.providers.JsonRpcProvider(url, chainId || 1)
  }

  public getBlockNumber = async (): Promise<number> => {
    return await this.provider.getBlockNumber()
  }

  public getBlock = async (blockNumber: number): Promise<Block> => {
    const block = await this.provider.send('eth_getBlockByNumber', [blockNumber, false])
    const newMappedBlock: Block = {
      ...block,
      blockNumber: parseInt(block.number, 16)
    }
    return newMappedBlock
  }

  public getTransaction = async (txHash: string): Promise<Transaction> => {
    const transaction = await this.provider.send('eth_getTransactionByHash', [txHash])
    const newMappedTransaction: Transaction = {
      ...transaction,
      value: transaction.value.toString()
    }
    return newMappedTransaction
  }

  public getTransactionReceipt = async (txHash: string): Promise<TransactionReceipt> => {
    return await this.provider.send('eth_getTransactionReceipt', [txHash])
  }

  public getTransactionTrace = async (txHash: string): Promise<TransactionTrace> => {
    return await this.provider.send('debug_traceTransaction', [txHash, {}])
  }

  public getTransactionCount = async (contractAddress: string): Promise<number> => {
    return await this.provider.getTransactionCount(contractAddress)
  }

  public getCode = async (contractAddress: string): Promise<string> => {
    return await this.provider.getCode(contractAddress)
  }
}
