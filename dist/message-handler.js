"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MessageHandler {
    constructor() {
        this.handlers = {};
        this.addHandler = (op, action, handler) => {
            let handlers = this.handlers[`${op}_${action}`];
            if (typeof handlers === 'undefined') {
                handlers = [];
            }
            handlers = [...handlers, handler];
            this.handlers[`${op}_${action}`] = handlers;
        };
        this.run = (op, action, client, data) => {
            const handlers = this.handlers[`${op}_${action}`];
            if (handlers === undefined) {
                return;
            }
            handlers.forEach(handler => {
                handler(client, data);
            });
        };
    }
}
exports.MessageHandler = MessageHandler;
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
