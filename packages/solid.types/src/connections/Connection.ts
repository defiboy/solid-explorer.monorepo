export interface BlockProcessed {
    blockNumber: number
    transactionHash: string
    logIndex: number
}

export interface Connection {
    id: number
    name: string
    url: string
    lastBlockProcessed?: BlockProcessed
}

// export interface Connection {
//     _id?: string
//     name: string
//     url: string
//     // transactionReceipts: Transaction[] TODO
//     // contractInstances?: Contract[] TODO
// }