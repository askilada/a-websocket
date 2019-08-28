import * as WebSocket from 'ws'
import {Server as WebSocketServer} from 'ws'
import {IncomingMessage} from "http";
import * as crypto from 'crypto'
import {ServerClient} from "./server-client";
import {IServer} from "./iserver";
import {MessageHandler} from "./message-handler";


export type ConnectionMiddleware<T extends WebSocket> = (ws: T, msg: IncomingMessage) => T


export class Server<T extends WebSocket> implements IServer<T> {

    private clients: ServerClient<T>[] = []
    private connectionMiddleware: any[] = []

    public readonly messageHandler = new MessageHandler<T>()

    constructor(
        private server: WebSocketServer) {

        server.on('connection', this.handleIncomingConnection)



        // setInterval(() => {
        //     this.broadcast(0, 'time', Date.now())
        // }, 5000)

    }

    broadcast = (op:number, action: string, message: any) => {

        this.clients.forEach(client => {
            client.sendSuccessResponse(op, action, message)
        })

    }

    addConnectionMiddleware = (middleware: ConnectionMiddleware<T>) => {
        this.connectionMiddleware.push(middleware)
    }

    handleIncomingConnection = (ws: WebSocket, msg: IncomingMessage) => {
        crypto.randomBytes(10, (err, buf) => {
            if(err) {
                console.error("Error while generate random bytes")
                console.error(err)
                ws.close(99)
                return
            }

            const id = crypto.createHash('sha1').update(buf).digest('hex')
            console.log('Connection ID:', id)


            const middlewares = [...this.connectionMiddleware]
            const newWs = middlewares.reduce((previousValue, currentValue, currentIndex) => {
                return currentValue(ws, msg)
            }, ws)


            this.addConnection(new ServerClient<T>(id, newWs as T, this))
        })
    }


    addConnection = (client: ServerClient<T>) => {
        this.clients.push(client)
    }

    removeConnection = (clientId: string) => {
        this.clients = this.clients.filter(c => c.id !== clientId)
    }

}