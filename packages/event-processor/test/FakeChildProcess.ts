import { EventEmitter } from "events"
import { ChildMessage } from '../src/types'

export class FakeChildProcess extends EventEmitter {
    public receivedMessages: ChildMessage[] = []

    constructor() {
        super();
    }

    send(message: ChildMessage) {
        this.receivedMessages.push(message);
    }

    emitMessage(message) {
        this.emit('message', message)
    }

    kill() {

    }
}