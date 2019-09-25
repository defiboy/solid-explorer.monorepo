import { Connection } from './Connection'

export const buildFakeConnection = (): Connection => {
    const connection: Connection = {
        name: "Connection 1",
        url: "http://localhost:8545",
        id: 1
    }

    return connection
}

export const buildFakeConnections = (): Connection[] => {
    const connections: Connection[] = [
        buildFakeConnection(),
        {
            name: "Connection 2",
            url: "http://localhost:9000",
            id: 2
        }]

    return connections
}
