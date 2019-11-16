export const BASE_URL = 'http://localhost:3030'

const CONTRACTS_ENDPOINT = 'contracts'
const BLOCKS_ENDPOINT = 'blocks'
const CONNECTIONS_ENDPOINT = 'connections'
const TRANSACTIONS_ENDPOINT = 'transaction-receipts'
const CONTRACT_DEFINITIONS_ENDPOINT = 'contract-definitions'

export const CONTRACTS_URL = `${BASE_URL}/${CONTRACTS_ENDPOINT}`
export const BLOCKS_URL = `${BASE_URL}/${BLOCKS_ENDPOINT}`
export const CONNECTION_URL = `${BASE_URL}/${CONNECTIONS_ENDPOINT}`
export const TRANSACTIONS_URL = `${BASE_URL}/${TRANSACTIONS_ENDPOINT}`
export const CONTRACT_DEFINITIONS_URL = `${BASE_URL}/${CONTRACT_DEFINITIONS_ENDPOINT}`
