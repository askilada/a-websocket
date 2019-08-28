"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
const WebSocket = require("ws");
const ws_1 = require("ws");
const server_client_1 = require("../server-client");
const wss = new ws_1.Server({
    port: 5001,
});
wss.on('listening', () => {
    const ws = new WebSocket("ws://127.0.0.1:5001", {
        headers: {
            authorization: 'Bearer Demo'
        }
    });
    const client = new __1.Client(ws);
    client.messageHandler.addHandler(1, 'sign-in-success', (client1, data) => {
        if (client1 instanceof __1.Client) {
            console.log(`Success`, data.token);
        }
    });
    client.sendMessage(1, 'sign-in', { username: "demo", password: "demo" });
});
const server = new __1.Server(wss);
server.addConnectionMiddleware((ws, msg) => {
    ws.user = "Weee";
    const authHeader = msg.headers.authorization;
    if (typeof authHeader === "undefined") {
        ws.close();
        return ws;
    }
    console.log(`Auth header ${authHeader}`);
    return ws;
});
server.messageHandler.addHandler(1, 'sign-in', (client, data) => {
    if (client instanceof server_client_1.ServerClient) {
        console.log(`Handling sign in`);
        console.log(client.socket.user);
        client.sendSuccessResponse(1, 'sign-in-success', { token: "123" });
        client.sendSuccessResponse(1, 'sign-in-failure');
    }
});
