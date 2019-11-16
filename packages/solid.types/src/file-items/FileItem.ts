import { ContractDefinition } from '../contract-definitions'

export interface FileItem {
  id?: string
  name: string
  path: string
  isDirectory: boolean
  sourceCode?: string
  flattenSourceCode?: string
  fileItems?: FileItem[]
  contraDefinition?: ContractDefinition
}
