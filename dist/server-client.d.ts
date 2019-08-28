import * as WebSocket from "ws";
import { IServer } from "./iserver";
export declare class ServerClient<T extends WebSocket> {
    readonly id: string;
    readonly socket: T;
    private server;
    private errorCount;
    constructor(id: string, socket: T, server: IServer<T>);
    handleIncomingMessage: (msg: WebSocket.Data) => void;
    sendErrorResponse: (message: any) => void;
    logMessage: (sending: boolean, op: number, action: string, data?: any) => void;
    sendSuccessResponse: (op: number, action: string, data?: any) => void;
}
