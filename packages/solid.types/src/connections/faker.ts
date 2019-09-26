import { Connection } from './Connection'

export const buildFakeConnection = ({
  name = 'Connection 1',
  url = 'http://localhost:8545',
  id = 1
} = {}): Connection => ({
  name,
  url,
  id
})

export const buildFakeConnections = (): Connection[] => {
  return [
    buildFakeConnection(),
    buildFakeConnection(
      {
        name: 'Connection 2',
        url: 'http://localhost:9000',
        id: 2
      })
  ]
}
