import { randomHex } from 'web3-utils'

import { buildFakeBlock, buildFakeTransaction, buildFakeTransactionReceipt, buildFakeConnection, buildFakeTrace } from '@solid-explorer/types'
import { Web3Wrapper } from '@solid-explorer/web3'

import { PollingService, IPollingService } from '../src/PollingService'
import { BlockProcessor } from '../src/BlockProcessor'
import { startAction, stopAction } from '../src/actions'
import { Status, BlockData, ResultMessage } from '../src/types'

import { FakeParentProcess } from './FakeParentProcess'
import { delay } from './utils'

jest.setTimeout(10000)

jest.mock('@solid-explorer/web3')

describe('BlockProcessor tests', () => {

    let blockProcessorInstance: BlockProcessor
    let pollingService: IPollingService
    let fakeParentProcess: FakeParentProcess
    let blockDataSample: BlockData

    beforeEach(() => {
        jest.resetAllMocks()
        const startTime: number = Date.now()
        pollingService = new PollingService()
        fakeParentProcess = new FakeParentProcess()
        blockProcessorInstance = new BlockProcessor(fakeParentProcess as any, pollingService);

        const blockNumber = 2;
        const transactionsHashes = [randomHex(32), randomHex(32)]
        const block = buildFakeBlock({
            blockNumber,
            transactions: transactionsHashes
        })
        const transactions = [
            buildFakeTransaction({
                hash: transactionsHashes[0]
            }),
            buildFakeTransaction({
                hash: transactionsHashes[1]
            })
        ]
        const transactionReceipts = [
            buildFakeTransactionReceipt({
                transactionHash: transactionsHashes[0]
            }),
            buildFakeTransactionReceipt({
                transactionHash: transactionsHashes[1]
            })
        ]

        const transactionTraces = [
            buildFakeTrace({
                transactionHash: transactionsHashes[0]
            }),
            buildFakeTrace({
                transactionHash: transactionsHashes[1]
            })
        ]
        blockDataSample = {
            connection: buildFakeConnection({
                id: 1
            }),
            transactionReceipts,
            transactions,
            block,
            contracts: [],//buildFakeContracts(),
            transactionTraces
        };

        (Web3Wrapper as jest.Mock<Web3Wrapper>).mockImplementation(() => {
            return {
                provider: undefined,
                getBlockNumber: () => {
                    console.log("Calling getBlockNumber", Date.now() - startTime)
                    return Promise.resolve(blockNumber);
                },
                getBlock: (blockNumber: number) => {
                    console.log(`Calling getBlock ${blockNumber}`, Date.now() - startTime)
                    return Promise.resolve(block)
                },
                getTransaction: (txHash: string) => {
                    console.log("Calling getTransaction", Date.now() - startTime)
                    return Promise.resolve(buildFakeTransaction({
                        hash: txHash
                    }))
                },
                getTransactionReceipt: (txHash: string) => {
                    console.log("Calling getTransactionReceipt", Date.now() - startTime)
                    return Promise.resolve(buildFakeTransactionReceipt({
                        transactionHash: txHash
                    }))
                },
                getTransactionTrace: (txHash: string) => {
                    console.log("Calling getTransactionTrace", Date.now() - startTime)
                    return Promise.resolve(buildFakeTrace({
                        transactionHash: txHash
                    }))
                },
                getTransactionCount: (contractAddress: string) => {
                    console.log("Calling getTransactionCount", Date.now() - startTime)
                    return Promise.resolve(1);
                },
                getCode: (contractAddress: string) => {
                    console.log("Calling getCode", Date.now() - startTime)
                    return Promise.resolve("pragma solidity 0.4.12;..");
                }
            };
        });
    })

    test('that I can create an instance', () => {
        expect(blockProcessorInstance).toBeDefined()
    })

    test('that the initial status is NotStarted', () => {
        const status = blockProcessorInstance.getStatus()

        expect(status).toEqual(Status.NotStarted)
    })

    test('that i can start and stop the child process', async () => {
        const connectionId1 = 1
        const newConnection = buildFakeConnection({
            id: connectionId1
        })

        fakeParentProcess.emitMessage(startAction(newConnection))

        const status = blockProcessorInstance.getStatus()

        expect(status).toEqual(Status.Running)

        await delay(2000)

        fakeParentProcess.emitMessage(stopAction())

        await delay(2000)

        const statusAfter = blockProcessorInstance.getStatus()

        expect(statusAfter).toEqual(Status.Stopped)
    })

    test.skip('an error being thrown when not connection is provided', (done) => {
        try {
            fakeParentProcess.emitMessage(startAction(undefined as any))
        } catch (error) {
            expect(error).toBeDefined()
            expect(error.message).toEqual("Connection is undefined")
            done()
        }
    })

    test('should process a block', (done) => {
        const connectionId1 = 1
        const newConnection = buildFakeConnection({
            id: connectionId1
        })

        const mockReceivedMessage = (resultMessage: ResultMessage) => {
            expect(resultMessage.data.connection).toEqual(blockDataSample.connection)
            // TODO: ADD CONTRACTS TO THE BLOCK DATA RESULT 
            // ASSERT FOR THE REST OF BLOCK DATA INFORMATION expect(resultMessage.data).toEqual(blockDataSample) 
            done()
        }

        fakeParentProcess = new FakeParentProcess(mockReceivedMessage)
        blockProcessorInstance = new BlockProcessor(fakeParentProcess as any, pollingService);

        fakeParentProcess.emitMessage(startAction(newConnection))
    })
})