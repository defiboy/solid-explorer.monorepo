import { Server } from 'http';
import axios from 'axios';

import { startServer, getUrl } from './utils'

describe('@solid-explorer/server', () => {
    let server: Server

    beforeAll(async () => {
        server = await startServer()
    })

    test('that server is up and running', async () => {
        const { data } = await axios.get(getUrl());

        expect(data).toEqual('Solid Server Up & Running!')
    })

    afterAll(done => {
        server.close(done);
    });
})