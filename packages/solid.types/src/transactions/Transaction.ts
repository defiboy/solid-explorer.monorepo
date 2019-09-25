export interface Transaction {
    hash: string;
    nonce: number;
    blockHash: string | null;
    blockNumber: number | null;
    transactionIndex: number | null;
    from: string;
    to: string | null;
    value: string; // TODO?
    gasPrice: string;
    gas: number;
    input: string;
    connectionId: number // custom
}