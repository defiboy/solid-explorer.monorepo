import { Paginated } from '@feathersjs/feathers';

import { buildFakeBlock, Block, buildFakeConnection, Connection } from '@solid-explorer/types';

import { app } from '../../src';

describe('Blocks service', () => {

  beforeAll(async () => {
    const sequelise = app.get('sequelizeClient')

    await sequelise.sync({ force: true })
  })

  it('registered the service', () => {
    const service = app.service('blocks');

    expect(service).toBeTruthy();
  });

  it('creates a block entry', async () => {
    const sampleConnection = buildFakeConnection()
    const sampleBlock = buildFakeBlock()

    const blockService = app.service('blocks')
    const connectionService = app.service('connections')

    const connection: Connection = await connectionService.create(sampleConnection) as Connection

    expect(connection).toBeTruthy()
    expect(connection.id).toBeTruthy()
    expect(connection.id).toBeGreaterThan(0)

    const block: Block = await blockService.create({
      ...sampleBlock,
      connectionId: connection.id
    }) as Block;

    expect(block).toBeTruthy()
    expect(block.blockNumber).toEqual(sampleBlock.blockNumber)

    const blockFound = await blockService.find({
      hash: block.hash
    }) as Paginated<Block>

    expect(blockFound).toBeTruthy()
    expect(blockFound.data[0].transactions).toHaveLength(sampleBlock.transactions.length)
    expect(blockFound.data[0].blockNumber).toEqual(sampleBlock.blockNumber)
    expect(blockFound.data[0].connectionId).toEqual(sampleBlock.connectionId)
    expect(blockFound.data[0].hash).toEqual(sampleBlock.hash)
  })

});
