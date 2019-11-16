import { EventEmitter } from "events"
import { ResultMessage } from '../src/types'

export class FakeParentProcess extends EventEmitter {
    public receivedMessages: ResultMessage[] = []
    private onReceivedMessage?: (message: ResultMessage) => void

    constructor(onReceivedMessage?: (message: ResultMessage) => void) {
        super();
        this.onReceivedMessage = onReceivedMessage
    }

    send(message: ResultMessage) {
        console.log("RECEIVED HERE IN FAKE PARENT")
        this.receivedMessages.push(message)
        if (this.onReceivedMessage) {
            this.onReceivedMessage(message)
        }
    }

    emitMessage(message) {
        this.emit('message', message)
    }

    kill() {

    }
}