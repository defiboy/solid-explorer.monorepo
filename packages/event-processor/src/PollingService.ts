import { AsyncPolling } from '@solidstudio/async-polling'

export interface IPollingService {
  createPolling(pollingFunction: (end) => void, intervalMs: number): IAsyncPolling
}

export interface IAsyncPolling {
  start()
  stop()
}

export class PollingService implements IPollingService {
  public createPolling(pollingFunction: (end) => void, intervalMs: number): IAsyncPolling {
    const asyncPolling = new AsyncPolling(pollingFunction, intervalMs)
    return {
      start: () => asyncPolling.run(),
      stop: () => asyncPolling.stop()
    }
  }
}
