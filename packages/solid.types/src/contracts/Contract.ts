import { AbiItem } from "../contract-definitions";

export interface Contract {
    id: number
    name: string
    sourceCode: string
    abi: AbiItem[]
    bytecode: string
    address: string // TODO, for ALREADY DEPLOYED is fine, but for simulation?
    connectionId: string // TODO, for ALREADY DEPLOYED is fine, but for simulation?
    creationDate: string,
    lastExecutionDate: string,
    transactionCount: number
}