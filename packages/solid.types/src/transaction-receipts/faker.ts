import { TransactionReceipt } from './TransactionReceipt'

export const buildFakeTransactionReceipt = (): TransactionReceipt => {
  return {
    connectionId: 1,
    blockHash: '0xfac2431708c0698b66a3a4a3ad4ba44b268df402b9350a909175d6ce6ca9004f',
    blockNumber: 646892,
    contractAddress: '0xb5a04884b36984a4d27a796e7fa75561d6a5533a',
    cumulativeGasUsed: 0,
    from: '0x97a4a7b888d9ffa3a4e4c5a407bb557a6a2b7be8',
    gasUsed: 0,
    status: true,
    to: null,
    transactionHash: '0xdf7f4433c421ab496a15066c14188b3e1973591cf539a9bd55009f108fddb668',
    transactionIndex: 0
  }
}

export const buildFakeTransactionReceipts = (): TransactionReceipt[] => {
  return [
    buildFakeTransactionReceipt(),
    {
      connectionId: 1,
      blockHash: '0xdac2431708c0698b66a3a4a3ad4ba44b268df402b9350a909175d6ce6ca9004d',
      blockNumber: 646893,
      contractAddress: '0xb5a04884b36984a4d27a796e7fa75561d6a5533a',
      cumulativeGasUsed: 0,
      from: '0x97a4a7b888d9ffa3a4e4c5a407bb557a6a2b7be8',
      gasUsed: 0,
      status: true,
      to: null,
      transactionHash: '0xdf7f4433c421ab496a15066c14188b3e1973591cf539a9bd55009f108fddb667',
      transactionIndex: 0
    }
  ]
}
