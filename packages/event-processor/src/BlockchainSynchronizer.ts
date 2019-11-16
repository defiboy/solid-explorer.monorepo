import { Connection } from '@solid-explorer/types'
import { ChildProcess, fork } from 'child_process'
import path from 'path'

import { startAction, stopAction, unPauseAction } from './actions'
import { ITransactionProcessor } from './ITransactionProcessor'
import { ResultMessage } from './types'

export interface IBlockchainSynchronizer {
  startChildProcessFor: (connection: Connection) => void
  stop: (id: number) => void
  killAllProcesses: () => void
}

export class BlockchainSynchronizer implements IBlockchainSynchronizer {
  private childProcesses: Map<number, ChildProcess> = new Map()
  private transactionProcessor: ITransactionProcessor

  constructor(transactionProcessor: ITransactionProcessor) {
    this.transactionProcessor = transactionProcessor
  }

  public stop(connectionId: number) {
    const child = this.childProcesses.get(connectionId)
    if (!child) {
      throw new Error(`Child ${connectionId} doesn't exits`)
    }
    this.stopChildProcess(connectionId)
  }

  public startChildProcessFor(connection: Connection) {
    if (!connection.id) {
      throw new Error('Invalid connection')
    }

    if (this.childProcesses.get(connection.id)) {
      throw new Error(`There is a child process already registered for ${connection.id}`)
    }

    const childProcessLocation = path.join(__dirname, '..', 'lib', 'BlockProcessor.js')
    const newProcess = fork(childProcessLocation)
    newProcess.on('message', this.handleChildProcessMessage.bind(this))
    this.childProcesses.set(connection.id, newProcess)
    this.startPolling(connection.id, connection)
  }

  public killAllProcesses() {
    this.childProcesses.forEach(child => {
      child.send(stopAction())
      child.kill()
    })
  }

  public startPolling(id: number, connection: Connection) {
    this.getChildProcess(id).send(startAction(connection))
  }

  public async handleChildProcessMessage(message: ResultMessage) {
    const { data } = message

    if (!data.connection) {
      throw new Error('Invalid connection')
    }

    try {
      const newConnection = await this.transactionProcessor.processTransaction(data)
      this.unPauseChildProcess(data.connection.id as number, newConnection)
    } catch (error) {
      throw error
    }
  }

  private unPauseChildProcess(id: number, connection: Connection) {
    this.getChildProcess(id).send(unPauseAction(connection))
  }

  private stopChildProcess(id: number) {
    this.getChildProcess(id).send(stopAction())
  }

  private getChildProcess(id: number) {
    const child = this.childProcesses.get(id)
    if (!child) {
      throw new Error(`The child ${id} doesn't exist`)
    }
    return child
  }
}
