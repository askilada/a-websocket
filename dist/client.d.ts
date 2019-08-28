import * as WebSocket from 'ws';
import { MessageHandler } from "./message-handler";
export declare class Client<T extends WebSocket> {
    private ws;
    private queueRunning;
    private messageQueue;
    readonly messageHandler: MessageHandler<T>;
    constructor(ws: WebSocket);
    log: (message: string) => void;
    receiveMessage: (data: WebSocket.Data) => void;
    sendMessage: (op: number, action: string, data?: any) => void;
    addMessageToQueue: (message: any) => void;
    startMessageQueue: () => void;
    runMessageQueue: () => void;
}
