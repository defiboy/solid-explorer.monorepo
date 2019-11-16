import { buildFakeConnection } from "@solid-explorer/types"

import { BlockData, ITransactionProcessor } from "../src"

export class TestTransactionProcessor implements ITransactionProcessor {
    onProcessTransaction: (block: BlockData) => void

    constructor(onProcessTransaction) {
        this.onProcessTransaction = onProcessTransaction
    }

    async processTransaction(blockData: BlockData) {
        this.onProcessTransaction(blockData)
        return Promise.resolve(buildFakeConnection())
        // TODO: I may have trouble by having a set faker here.
        // Maybe I can add a method to set return value
        // or just return this.onProcessTransaction?
    }
}