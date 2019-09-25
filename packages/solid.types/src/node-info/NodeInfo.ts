export interface NodeInfo {
  enode: string
  id: string
  ip: string
  listenAddr: string
  name: string
  ports: {
    discovery: string | number
    listener: string | number
  }
  protocols: any // Any because it's not documented what each protocol (eth, shh etc.) is defining here
}
