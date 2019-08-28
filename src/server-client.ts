import * as WebSocket from "ws";
import {IServer} from "./iserver";
import {Data} from "ws";


export class ServerClient<T extends WebSocket> {
    private errorCount: number = 0

    constructor(
        public readonly id: string,
        public readonly socket: T,
        private server: IServer<T>
    ) {
        socket.on('close', () => {
            server.removeConnection(id)
        })
        socket.on('message', this.handleIncomingMessage)
    }


    handleIncomingMessage = (msg: Data) => {
        try {
            const data = JSON.parse(msg as string)
            if ((data.hasOwnProperty('op') || data.hasOwnProperty('action') )=== false) {
                return this.sendErrorResponse("Invalid request")
            }

            this.logMessage(false, data.op, data.action)

            this.server.messageHandler.run(data.op, data.action, this, data.data)

        }
        catch (e) {
            this.sendErrorResponse(e.message)

        }
    }


    sendErrorResponse = (message: any) => {
        console.error("-> [E]\t", message)
        this.errorCount++

        if(this.errorCount >= 3) {
            this.socket.close()
        }
    }


    logMessage = (sending: boolean, op: number, action: string, data: any = {}) => {
        const arrow = sending ? "->" : "<-"
        const opString = op.toString().padStart(4, ' ')
        const actionString = action.padStart(25, ' ')

        const text = []

        text.push(`| ${arrow} `)
        text.push(` ${this.id.substr(this.id.length - 16, 16)} `)
        text.push(` ${opString} `)
        text.push(` ${actionString} |`)


        console.log(text.join(`|`), JSON.stringify(data))

    }


    sendSuccessResponse = (op: number, action: string, data?: any) => {
        this.logMessage(true, op, action, data)

        const responseData = JSON.stringify({
            op,
            action,
            data
        })

        this.socket.send(responseData)
    }

}