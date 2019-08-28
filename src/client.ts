import * as  WebSocket from 'ws'
import {MessageHandler} from "./message-handler";
import {Data} from "ws";

export class Client<T extends WebSocket> {

    private queueRunning = false
    private messageQueue: any[] = []


    public readonly messageHandler = new MessageHandler<T>()

    constructor(
        private ws: WebSocket) {

        this.ws.on('message', this.receiveMessage)

    }


    log = (message: string) => {
        const messageA: string[] = []

        messageA.push(" [Client] ".padStart(10, ' '))
        messageA.push(message.padStart(50, ' '))

        console.log(messageA.join('|'))

    }


    receiveMessage = (data: Data) => {

        if(typeof data !== "string") {
            this.log("Message is not a string")
            return
        }
        try {
            const jsonData = JSON.parse(data)
            if((jsonData.hasOwnProperty('op') && jsonData.hasOwnProperty('action')) == false) {
                throw new Error("Missing op or action")
            }

            this.messageHandler.run(jsonData.op, jsonData.action, this, jsonData.data)
        }
        catch (e) {
            console.error(e)
            this.log(e.message)
        }
    }




    sendMessage = (op: number, action: string, data?: any) => {
        this.addMessageToQueue(JSON.stringify({op, action, data}))
    }


    addMessageToQueue = (message: any) => {
        this.messageQueue.push(message)

        if(!this.queueRunning) {
            this.startMessageQueue()
        }
    }


    startMessageQueue = () => {
        this.queueRunning = true
        this.runMessageQueue()
    }


    runMessageQueue = () => {
        if(!this.queueRunning || this.ws.readyState !== this.ws.OPEN || this.messageQueue.length === 0) {
            setTimeout(this.runMessageQueue, 100)
            return
        }

        const message = this.messageQueue.pop()

        console.log("Sending message", message)


        this.ws.send(message)

        setTimeout(this.runMessageQueue, 100)

    }

}