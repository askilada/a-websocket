/// <reference types="node" />
import * as WebSocket from 'ws';
import { Server as WebSocketServer } from 'ws';
import { IncomingMessage } from "http";
import { ServerClient } from "./server-client";
import { IServer } from "./iserver";
import { MessageHandler } from "./message-handler";
export declare type ConnectionMiddleware<T extends WebSocket> = (ws: T, msg: IncomingMessage) => T;
export declare class Server<T extends WebSocket> implements IServer<T> {
    private server;
    private clients;
    private connectionMiddleware;
    readonly messageHandler: MessageHandler<T>;
    constructor(server: WebSocketServer);
    broadcast: (op: number, action: string, message: any) => void;
    addConnectionMiddleware: (middleware: ConnectionMiddleware<T>) => void;
    handleIncomingConnection: (ws: WebSocket, msg: IncomingMessage) => void;
    addConnection: (client: ServerClient<T>) => void;
    removeConnection: (clientId: string) => void;
}
