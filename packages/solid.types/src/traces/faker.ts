import { TransactionTrace, StructLog } from './Trace'

export const buildFakeLogs = ({} = {}): StructLog[] => []

export const buildFakeTrace = ({
  gas = 10000,
  returnValue = 'any',
  structLogs = buildFakeLogs()
} = {}): TransactionTrace => ({
  gas,
  returnValue,
  structLogs
})
