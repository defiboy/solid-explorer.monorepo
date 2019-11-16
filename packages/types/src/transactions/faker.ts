import { Transaction } from './Transaction'

export const buildFakeTransaction = ({
  hash = '0xdac2431708c0698b66a3a4a3ad4ba44b268df402b9350a909175d6ce6ca9004f',
  nonce = 1,
  blockHash = '0xfac2431708c0698b66a3a4a3ad4ba44b268df402b9350a909175d6ce6ca9004f',
  blockNumber = 646892,
  transactionIndex = 0,
  from = '0x97a4a7b888d9ffa3a4e4c5a407bb557a6a2b7be8',
  to = null,
  value = '',
  gasPrice = '10000',
  gas = 100,
  input = '', // TODO FIX
  connectionId = 1
} = {}): Transaction => ({
  hash,
  nonce,
  blockHash,
  blockNumber,
  transactionIndex,
  from,
  to,
  value,
  gasPrice,
  gas,
  input,
  connectionId
})

export const buildFakeTransactions = (): Transaction[] => {
  return [
    buildFakeTransaction(),
    buildFakeTransaction({
      blockNumber: 646895,
      transactionIndex: 1,
      connectionId: 2
    })
  ]
}
