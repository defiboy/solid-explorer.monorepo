import { Web3Wrapper, IWeb3Wrapper } from '../src/index'

describe('@solid-explorer/web3 tests', () => {
    const DEFAULT_URL = 'http://localhost:8545'
    let web3Instance: IWeb3Wrapper

    beforeAll(async () => {
        web3Instance = new Web3Wrapper(DEFAULT_URL)
    })

    test('web3Instance is defined', () => {
        expect(web3Instance).toBeDefined()
    })
});
