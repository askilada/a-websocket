import { ServerClient } from "./server-client";
import * as WebSocket from "ws";
import { Client } from "./client";
export declare type Handler<WS extends WebSocket, Data = any> = (client: ServerClient<WS> | Client<WS>, data?: Data) => void;
interface Handlers<T extends WebSocket, D> {
    [key: string]: Array<Handler<T, D>>;
}
export declare class MessageHandler<T extends WebSocket> {
    handlers: Handlers<T, any>;
    addHandler: <D>(op: number, action: string, handler: Handler<T, D>) => void;
    run: (op: number, action: string, client: ServerClient<T> | Client<T>, data?: any) => void;
}
export {};
