export interface ContractDefinition {
  id?: number
  name: string
  sourceCode: string
  abi: AbiItem[]
  bytecode: string
  runtimeBycode: string
  sourceMap: string
  deployedSourceMap: string
}

export interface ContractDefinitionItem extends ContractDefinition {
  type: string
}

// https://github.com/ethereum/web3.js/blob/2.x/packages/web3-utils/types/index.d.ts
export type AbiType = 'function' | 'constructor' | 'event' | 'fallback'

export type StateMutabilityType = 'pure' | 'view' | 'nonpayable' | 'payable'

export interface AbiItem {
  anonymous?: boolean
  constant?: boolean
  inputs?: AbiInput[]
  name?: string
  outputs?: AbiOutput[]
  payable?: boolean
  stateMutability?: StateMutabilityType
  type: AbiType
}

export interface AbiInput {
  name: string
  type: string
  indexed?: boolean
  components?: AbiInput[]
}

export interface AbiOutput {
  name: string
  type: string
  components?: AbiOutput[]
}
