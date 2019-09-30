import { AbiItem } from '../contract-definitions'

export interface Contract {
  id?: number
  name: string
  sourceCode: string
  abi: AbiItem[]
  bytecode: string
  runtimeBycode: string
  address: string // TODO, for ALREADY DEPLOYED is fine, but for simulation?
  connectionId: number // TODO, for ALREADY DEPLOYED is fine, but for simulation?
  creationDate: string
  lastExecutionDate: string
  transactionCount: number
}
