import {ServerClient} from "./server-client";
import * as WebSocket from "ws";
import {Client} from "./client";

export type Handler<WS extends WebSocket, Data=any> = (client: ServerClient<WS>|Client<WS>, data?: Data) => void


interface Handlers<T extends WebSocket, D> {
    [key: string]: Array<Handler<T,D>>
}


export class MessageHandler<T extends WebSocket> {
    handlers: Handlers<T, any> = {}


    addHandler = <D>(op: number, action: string, handler: Handler<T, D>) => {
        let handlers = this.handlers[`${op}_${action}`]

        if(typeof handlers === 'undefined') {
            handlers = []
        }

        handlers = [...handlers, handler]

        this.handlers[`${op}_${action}`] = handlers

    }

    run = (op: number, action: string, client: ServerClient<T>, data?: any) => {

        const handlers = this.handlers[`${op}_${action}`]

        if(handlers === undefined) {
            return
        }

        handlers.forEach(handler => {
            handler(client, data)
        })
    }

}


// export type Handler<T, WS extends WebSocket> = (client: ServerClient<WS>, data?: T) => void
//
// export class MessageHandler<WS extends WebSocket> {
//     handlers: {[key: string]: Handler<any, WS>[]} = {}
//
//
//     addHandler = <WS extends WebSocket, T=any>(op: number, action: string, handler: Handler<T, WS>) => {
//         let handlers = this.handlers[`${op}_${action}`]
//
//         if(typeof handlers === 'undefined') {
//             handlers = []
//         }
//         handlers = [...handlers, handler]
//         this.handlers[`${op}_${action}`] = handlers
//     }
//
//
//     run = (op: number, action: string, client: ServerClient<any>, data?: any) => {
//
//         const handlers = this.handlers[`${op}_${action}`]
//
//         if(handlers === undefined) {
//             return
//         }
//
//         handlers.forEach(handler => {
//             handler(client, data)
//         })
//
//
//     }
//
// }