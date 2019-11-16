import { Server } from 'http';
import axios from 'axios';

import { buildFakeConnection } from '@solid-explorer/types';

import { startServer, getUrl } from './utils'

jest.setTimeout(10000)

describe('Connection endpoint tests', () => {
    let server: Server

    beforeAll(async () => {
        server = await startServer()
    })

    test('POST connection', async () => {
        const baseURL = getUrl()
        const endpointURL = `${baseURL}/connections`
        const newConnection = buildFakeConnection()
        delete newConnection.id

        const { data } = await axios.post(endpointURL, newConnection);

        expect(data).toBeDefined()
        expect(data.id).toBeGreaterThan(0)
        expect(data.id).toBeDefined()
        expect(data.name).toEqual(newConnection.name)
        expect(data.url).toEqual(newConnection.url)
        expect(data.lastBlockNumberProcessed).toEqual(0)
    })

    afterAll(done => {
        server.close(done);
    });
})