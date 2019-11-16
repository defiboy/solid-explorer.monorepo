import { Application } from '@feathersjs/feathers'
import { Service } from 'feathers-sequelize'
import { Sequelize } from 'sequelize'

import { BlockData, ITransactionProcessor } from '@solid-explorer/event-processor'
import { Block, Connection, Contract, ContractDefinition, Transaction, TransactionReceipt } from '@solid-explorer/types'

export class SequelizeTransactionProcessor implements ITransactionProcessor {
  private readonly sequelize: Sequelize

  private readonly connectionService: Service<Connection>
  private readonly transactionsService: Service<Transaction>
  private readonly contractDefinitionsService: Service<ContractDefinition>
  private readonly contractsService: Service<Contract>
  private readonly blocksService: Service<Block>
  private readonly transactionReceiptsService: Service<TransactionReceipt>

  constructor(app: Application) {
    this.sequelize = app.get('sequelizeClient')
    this.connectionService = app.service('connections')
    this.transactionsService = app.service('transactions')
    this.transactionReceiptsService = app.service('transaction-receipts')
    this.blocksService = app.service('blocks')
    this.contractDefinitionsService = app.service('contract-definitions')
    this.contractsService = app.service('contracts')
  }

  public async processTransaction(blockData: BlockData): Promise<Connection> {
    // pending transaction traces
    const { block, transactionReceipts, transactions, connection, contracts } = blockData

    return new Promise((resolve, reject) => {
      this.sequelize
        .transaction(async transaction => {
          await this.blocksService.create(block, { sequelize: { transaction } }) // Blocks
          await this.transactionsService.create(transactions, { sequelize: { transaction } }) // Transactions
          await this.transactionReceiptsService.create(transactionReceipts, { sequelize: { transaction } }) // Transaction Receipts
          await this.contractsService.create(contracts, { sequelize: { transaction } }) // Contracts

          return await this.connectionService.update(
            connection.id as number,
            {
              ...connection,
              lastBlockNumberProcessed: block.blockNumber
            },
            { sequelize: { transaction } }
          )
        })
        .then(result => {
          resolve(result)
        })
        .catch(error => {
          reject(error)
          // TODO RETRY
        })
    })
  }
}
