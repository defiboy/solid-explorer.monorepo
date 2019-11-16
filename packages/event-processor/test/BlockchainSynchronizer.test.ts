import { fork } from 'child_process'
import { buildFakeConnection, buildFakeTransactionReceipts, buildFakeTransactions, buildFakeBlock, buildFakeTraces, buildFakeContracts } from "@solid-explorer/types";

import { BlockchainSynchronizer, ITransactionProcessor, IBlockchainSynchronizer, BlockData } from '../src/index'
import { startAction, stopAction, resultAction } from '../src/actions';

import { FakeChildProcess } from './FakeChildProcess'

jest.mock('child_process')

const mockChildProcess = {
    send: jest.fn(),
    on: jest.fn(),
    kill: jest.fn()
}

const mockProcessTransaction = jest.fn()

const mockTransactionProcessor: ITransactionProcessor = {
    processTransaction: mockProcessTransaction
}

describe('@solid-explorer/event-processor', () => {

    let blockchainSynchronizerInstance: IBlockchainSynchronizer

    beforeEach(() => {
        jest.resetAllMocks();
        (fork as any).mockImplementation(() => {
            return mockChildProcess;
        });

        blockchainSynchronizerInstance = new BlockchainSynchronizer(mockTransactionProcessor)
    })

    test('that instance is created', () => {
        expect(blockchainSynchronizerInstance).toBeDefined()
    });

    test('[startChildProcessFor] - that a valid connection has to be passed', () => {
        try {
            const newConnection = buildFakeConnection()
            newConnection.id = undefined
            blockchainSynchronizerInstance.startChildProcessFor(newConnection)
        } catch (error) {
            expect(error).toBeDefined()
            expect(error.message).toEqual('Invalid connection')
        }
    });

    test('[startChildProcessFor] - that a message is received in the child process to start polling', async () => {
        const id = 1
        const newConnection = buildFakeConnection({
            id
        })

        blockchainSynchronizerInstance.startChildProcessFor(newConnection)

        expect(mockChildProcess.send).toHaveBeenCalledTimes(1)
        expect(mockChildProcess.send).toHaveBeenCalledWith(startAction(newConnection))
        expect(mockChildProcess.on).toHaveBeenCalledTimes(1)
    })

    test('[startChildProcessFor] - that a connection was already registered', async () => {
        const id = 1
        const newConnection = buildFakeConnection({
            id
        })

        blockchainSynchronizerInstance.startChildProcessFor(newConnection)

        expect(mockChildProcess.send).toHaveBeenCalledTimes(1)
        expect(mockChildProcess.send).toHaveBeenCalledWith(startAction(newConnection))
        expect(mockChildProcess.on).toHaveBeenCalledTimes(1)

        try {
            blockchainSynchronizerInstance.startChildProcessFor(newConnection)
        } catch (error) {
            expect(error).toBeDefined()
            expect(error.message).toEqual(`There is a child process already registered for ${newConnection.id}`)
        }
    })

    test('[stop] - that a message is received in the child process to stop polling', async () => {
        const id = 1
        const newConnection = buildFakeConnection({
            id
        })

        blockchainSynchronizerInstance.startChildProcessFor(newConnection)

        expect(mockChildProcess.send).toHaveBeenCalledTimes(1)
        expect(mockChildProcess.send).toHaveBeenCalledWith(startAction(newConnection))
        expect(mockChildProcess.on).toHaveBeenCalledTimes(1)

        mockChildProcess.on.mockClear()
        mockChildProcess.send.mockClear()

        blockchainSynchronizerInstance.stop(id)

        expect(mockChildProcess.send).toHaveBeenCalledTimes(1)
        expect(mockChildProcess.send).toHaveBeenCalledWith(stopAction())
        expect(mockChildProcess.on).toHaveBeenCalledTimes(0)
    })

    test('[stop] - that a child process does not exists', async () => {
        const id = 1

        try {
            blockchainSynchronizerInstance.stop(id)
        } catch (error) {
            expect(error).toBeDefined()
            expect(error.message).toEqual(`Child ${id} doesn't exits`)

        }
    })

    test('[killAllProcesses] - that all processes are being stopped', async () => {
        const connectionId1 = 1
        const newConnection = buildFakeConnection({
            id: connectionId1
        })

        blockchainSynchronizerInstance.startChildProcessFor(newConnection)

        const connectionId2 = 2
        const newConnection2 = buildFakeConnection({
            id: connectionId2
        })

        blockchainSynchronizerInstance.startChildProcessFor(newConnection2)

        mockChildProcess.send.mockClear()

        blockchainSynchronizerInstance.killAllProcesses()

        expect(mockChildProcess.send).toHaveBeenCalledTimes(2)
        expect(mockChildProcess.send).nthCalledWith(1, stopAction())
        expect(mockChildProcess.send).nthCalledWith(2, stopAction())
    })

    test('[handleChildProcessMessage] - that is process the block data?', async () => {
        const connectionId1 = 1
        const newConnection = buildFakeConnection({
            id: connectionId1
        })

        const fakeChildProcess = new FakeChildProcess();

        (fork as any).mockImplementation(() => {
            return fakeChildProcess;
        });

        blockchainSynchronizerInstance.startChildProcessFor(newConnection);

        const blockData: BlockData = {
            connection: buildFakeConnection(),
            transactionReceipts: buildFakeTransactionReceipts(),
            transactions: buildFakeTransactions(),
            block: buildFakeBlock(),
            contracts: buildFakeContracts(),
            transactionTraces: buildFakeTraces()
        }

        fakeChildProcess.emitMessage(resultAction(blockData));

        expect(mockTransactionProcessor.processTransaction).toHaveBeenCalledWith(blockData)
    })
});