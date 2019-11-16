import { buildFakeTransaction, Transaction, buildFakeConnection, Connection } from '@solid-explorer/types';

import { app } from '../../src';
import { Paginated } from '@feathersjs/feathers';

describe('Transactions service', () => {

  beforeAll(async () => {
    const sequelise = app.get('sequelizeClient')

    await sequelise.sync({ force: true })
  })

  it('registered the service', () => {
    const service = app.service('transactions');
    expect(service).toBeTruthy();
  });

  it('creates a transaction entry', async () => {
    const sampleConnection = buildFakeConnection()
    const sampleTransaction = buildFakeTransaction()

    const transactionsService = app.service('transactions')
    const connectionService = app.service('connections')

    const connection: Connection = await connectionService.create(sampleConnection) as Connection

    expect(connection).toBeTruthy()
    expect(connection.id).toBeTruthy()
    expect(connection.id).toBeGreaterThan(0)

    const transaction: Transaction = await transactionsService.create({
      ...sampleTransaction,
      connectionId: connection.id
    }) as Transaction

    expect(transaction).toBeTruthy()
    expect(transaction.blockNumber).toEqual(sampleTransaction.blockNumber)

    const transactionFound = await transactionsService.find({
      hash: transaction.hash
    }) as Paginated<Transaction>

    expect(transactionFound).toBeTruthy()
    expect(transactionFound.data[0].blockNumber).toEqual(sampleTransaction.blockNumber)
    expect(transactionFound.data[0].connectionId).toEqual(sampleTransaction.connectionId)
    expect(transactionFound.data[0].hash).toEqual(sampleTransaction.hash)
  })
});
