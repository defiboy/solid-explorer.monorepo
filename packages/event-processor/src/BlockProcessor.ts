import Bottleneck from 'bottleneck'

import { Block, Connection, Contract, Transaction, TransactionReceipt, TransactionTrace } from '@solid-explorer/types'
import { IWeb3Wrapper, Web3Wrapper } from '@solid-explorer/web3'

import { resultAction } from './actions'
import { IAsyncPolling, IPollingService, PollingService } from './PollingService'
import { BlockData, ChildMessage, MessageType, Status } from './types'

/* tslint:disable:no-console */
export class BlockProcessor {
  private status: Status
  private connection?: Connection

  private readonly limiter: Bottleneck
  private readonly pollingServiceFactory: IPollingService
  private readonly asyncPolling: IAsyncPolling
  private readonly process: NodeJS.Process

  private web3Wrapper?: IWeb3Wrapper
  private rateLimitedGetTransactionReceipt?: (txHash: string) => Promise<TransactionReceipt>
  private rateLimitedGetTransactionTrace?: (txHash: string) => Promise<TransactionTrace>
  private rateLimitedGetTransaction?: (txHash: string) => Promise<Transaction>
  private rateLimitedGetBlock?: (blockNumber: number) => Promise<Block>
  private rateLimitedGetBlockNumber?: () => Promise<number>
  private rateLimitedGetTransactionCount?: (contractAddress: string) => Promise<number>
  private rateLimitedGetCode?: (contractAddress: string) => Promise<string>

  constructor(process: NodeJS.Process, pollingServiceFactory: IPollingService) {
    this.process = process
    this.pollingServiceFactory = pollingServiceFactory
    this.limiter = new Bottleneck({
      maxConcurrent: 1,
      minTime: 210
    })

    this.status = Status.NotStarted

    this.asyncPolling = this.pollingServiceFactory.createPolling(end => {
      this.synchronize().then(() => {
        end()
      })
    }, 1000) // TODO: this.connection.blockPeriodTime

    this.process.on('message', async (message: ChildMessage) => {
      switch (message.type) {
        case MessageType.Start:
          await this.start(message.data)
          break
        case MessageType.Unpause:
          this.updateConnection(message.data)
          this.unpause()
          break
        case MessageType.Stop:
          await this.stop()
          this.status = Status.Stopped
          break
        case MessageType.Pause:
          this.pause()
          break
        default:
          return
      }
    })

    this.limiter.on('failed', async (error, jobInfo) => {
      const id = jobInfo.options.id
      console.warn(`Job ${id} failed: ${error}`)

      if (jobInfo.retryCount === 0) {
        // Here we only retry once
        console.log(`Retrying job ${id} in 25ms!`)
        return 25
      }
    })

    // Listen to the "retry" event
    this.limiter.on('retry', (error, jobInfo) => console.log(`Now retrying ${jobInfo.options.id}`))
  }

  public getStatus() {
    return this.status
  }

  public async getContracts(connectionId: number, transactionReceipts: TransactionReceipt[]): Promise<Contract[]> {
    if (!this.rateLimitedGetCode) {
      throw new Error('rateLimitedGetCode is undefined')
    }

    if (!this.rateLimitedGetTransactionCount) {
      throw new Error('rateLimitedGetTransactionCount is undefined')
    }

    const getCode = this.rateLimitedGetCode
    const getTransactionCount = this.rateLimitedGetTransactionCount

    const contractsCreationReceipts = transactionReceipts.filter(item => {
      return item.contractAddress != null && item.contractAddress !== undefined
    })

    return new Promise(async (resolve, reject) => {
      const result: Contract[] = []
      try {
        for (const item of contractsCreationReceipts) {
          const runtimeByteCode = item.contractAddress ? await getCode(item.contractAddress) : ''
          const transactionCount = item.contractAddress ? await getTransactionCount(item.contractAddress) : 0
          // console.log('runtimeByteCode from web3', runtimeByteCode)
          // console.log('transaction count from web3', transactionCount)
          const newContract: Contract = {
            name: '--',
            sourceCode: '--',
            abi: [],
            bytecode: '',
            address: item.contractAddress || '',
            runtimeBycode: runtimeByteCode,
            connectionId,
            creationDate: new Date().toLocaleDateString(),
            lastExecutionDate: new Date().toLocaleDateString(),
            transactionCount
          }
          result.push(newContract)
        }
      } catch (error) {
        console.log('An error ocurred in getContracts', error, error.message)
        reject(error)
      }
      resolve(result)
    })
  }

  public async getBlock(blockNumber: number): Promise<Block | undefined> {
    let result: Block | undefined

    if (!this.rateLimitedGetBlock) {
      throw new Error('rateLimitedGetBlock is undefined')
    }

    try {
      result = await this.rateLimitedGetBlock(blockNumber)
      return result
    } catch (error) {
      console.log('ERROR in getBlock', error, error.message)
      throw new Error("Couldn't get the Block")
    }
  }

  public async getTransactions(block: Block): Promise<Transaction[]> {
    let result: Transaction[] = []

    if (!this.rateLimitedGetTransaction) {
      throw new Error('rateLimitedGetTransaction is undefined')
    }

    const getTransaction = this.rateLimitedGetTransaction

    try {
      const promises = block.transactions.map(item => {
        return getTransaction(item)
      })
      result = await Promise.all(promises)
    } catch (error) {
      console.log('ERROR in getTransactions', error, error.message)
      throw new Error("Couldn't getTransactions")
    }
    return result
  }

  public async getTransactionReceipts(block: Block): Promise<TransactionReceipt[]> {
    let result: TransactionReceipt[] = []

    if (!this.rateLimitedGetTransactionReceipt) {
      throw new Error('rateLimitedGetTransactionReceipt is undefined')
    }

    const getTransactionReceipt = this.rateLimitedGetTransactionReceipt

    try {
      const promises = block.transactions.map(item => {
        return getTransactionReceipt(item)
      })
      result = await Promise.all(promises)
    } catch (error) {
      console.log('ERROR in getTransactionReceipts', error, error.message)
      throw new Error("Couldn't getTransactionReceipts")
    }
    return result
  }

  public async getTransactionTraces(block: Block): Promise<TransactionTrace[]> {
    let result: TransactionTrace[] = []

    if (!this.rateLimitedGetTransactionTrace) {
      throw new Error('rateLimitedGetTransactionTrace is undefined')
    }

    const getTransactionTrace = this.rateLimitedGetTransactionTrace

    try {
      const promises = block.transactions.map(item => {
        return getTransactionTrace(item)
      })
      result = await Promise.all(promises)
    } catch (error) {
      console.log('ERROR in getTransactionTraces', error, error.message)
      throw new Error("Couldn't getTransactionTraces")
    }
    return result
  }

  private async start(connection: Connection) {
    if (this.status === Status.NotStarted) {
      this.initialise(connection)
    }
    this.status = Status.Running
    await this.asyncPolling.start()
  }

  private initialise(connection: Connection) {
    if (!connection) {
      throw new Error('Connection is undefined')
    }
    this.connection = connection
    this.web3Wrapper = new Web3Wrapper(connection.url, this.connection.id) // uuid
    this.rateLimitedGetTransaction = this.limiter.wrap(this.web3Wrapper.getTransaction.bind(this))
    this.rateLimitedGetTransactionReceipt = this.limiter.wrap(this.web3Wrapper.getTransactionReceipt.bind(this))
    this.rateLimitedGetTransactionTrace = this.limiter.wrap(this.web3Wrapper.getTransactionTrace.bind(this))
    this.rateLimitedGetBlockNumber = this.limiter.wrap(this.web3Wrapper.getBlockNumber.bind(this))
    this.rateLimitedGetBlock = this.limiter.wrap(this.web3Wrapper.getBlock.bind(this))
    this.rateLimitedGetTransactionCount = this.limiter.wrap(this.web3Wrapper.getTransactionCount.bind(this))
    this.rateLimitedGetCode = this.limiter.wrap(this.web3Wrapper.getCode.bind(this))
  }

  private async stop() {
    try {
      await this.asyncPolling.stop()
      await this.limiter.stop()
      console.log('Shutdown completed!')
    } catch (error) {
      console.log('ERROR', error)
    }
  }

  private pause() {
    this.status = Status.Paused
  }

  private unpause() {
    this.status = Status.Running
  }

  private updateConnection(newConnection: Connection) {
    this.connection = newConnection
  }

  private async synchronize() {
    console.log('Starting to Synchronize')
    if (!this.connection) {
      throw new Error('Connection is undefined')
    }

    if (!this.rateLimitedGetBlockNumber) {
      throw new Error('rateLimitedGetBlockNumber is undefined')
    }

    if (this.status === Status.Paused) {
      return
    }

    try {
      const lastProcessedBlockNumber = this.connection.lastBlockNumberProcessed || 0
      const blockNumber = await this.rateLimitedGetBlockNumber()

      if (lastProcessedBlockNumber > blockNumber) {
        console.error(
          'BlockNumberInconsistency: Last processed block in DB is higher than last block in the blockchain'
        )
        console.log(
          `BlockNumberInconsistency BlockNumber: ${blockNumber}, lastProcessedBlockNumber: ${lastProcessedBlockNumber}`
        )
        return
      }

      if (lastProcessedBlockNumber === blockNumber) {
        console.log('NODE SYNCHRONIZED!!!')
        return
      }

      console.log(`BlockNumber: ${blockNumber}, lastProcessedBlockNumber: ${lastProcessedBlockNumber}`)

      const blockToProcess = lastProcessedBlockNumber + 1
      const block = await this.getBlock(blockToProcess)
      if (!block) {
        return
      }
      const transactionReceipts = await this.getTransactionReceipts(block)
      const transactions = await this.getTransactions(block)
      const contracts = await this.getContracts(this.connection.id as number, transactionReceipts)
      const transactionTraces = await this.getTransactionTraces(block)

      // Add connectionId to results
      const blockWithConnectionId: Block = {
        ...block,
        connectionId: (this.connection && this.connection.id) || 0
      }

      const transactionReceiptsWithConnectionId: TransactionReceipt[] = transactionReceipts.map(tx => {
        return {
          ...tx,
          connectionId: (this.connection && this.connection.id) || 0
        }
      })

      const transactionsWithConnectionId: Transaction[] = transactions.map(tx => {
        return {
          ...tx,
          connectionId: (this.connection && this.connection.id) || 0
        }
      })

      const transactionTracesWithConnectionId: TransactionTrace[] = transactionTraces.map(tx => {
        return {
          ...tx,
          connectionId: (this.connection && this.connection.id) || 0
        }
      })

      const blockData: BlockData = {
        transactionReceipts: transactionReceiptsWithConnectionId,
        transactions: transactionsWithConnectionId,
        block: blockWithConnectionId,
        contracts,
        connection: this.connection,
        transactionTraces: transactionTracesWithConnectionId
      }

      // tslint:disable-next-line
      if (this.process.send) {
        this.process.send(resultAction(blockData))
      }

      this.status = Status.Paused
    } catch (error) {
      console.log('An error ocurred in Synchronize', error)
    }
  }
}

if (process) {
  const pollingService = new PollingService()
  // tslint:disable-next-line
  new BlockProcessor(process, pollingService)
  console.log('Starting child process')
}
