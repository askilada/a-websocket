import { MessageHandler } from "./message-handler";
import * as WebSocket from "ws";
export interface IServer<T extends WebSocket> {
    removeConnection: (clientId: string) => void;
    messageHandler: MessageHandler<T>;
}
