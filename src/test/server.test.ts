import {Client, Server} from '../'

import * as WebSocket from 'ws'
import {Server as WebSocketServer} from "ws";
import {ServerClient} from "../server-client";

const wss = new WebSocketServer({
    port: 5001,
})

wss.on('listening', () => {
    const ws = new WebSocket("ws://127.0.0.1:5001", {
        headers: {
            authorization: 'Bearer Demo'
        }
    })
    const client = new Client(ws)
    client.messageHandler.addHandler<{token: string}>(1, 'sign-in-success', (client1, data) => {
        if (client1 instanceof Client) {
            console.log(`Success`, data.token)
        }
    })


    client.sendMessage(1, 'sign-in', {username: "demo", password: "demo"})

})
interface SocketExtra extends WebSocket{
    user?: any
}


const server = new Server<SocketExtra>(wss)



server.addConnectionMiddleware((ws, msg) => {
    ws.user = "Weee"
    const authHeader = msg.headers.authorization

    if (typeof authHeader === "undefined") {
        ws.close()
        return ws
    }

    console.log(`Auth header ${authHeader}`)

    return ws
})


interface SignInData {
    username: string
    password: string
}
server.messageHandler.addHandler<SignInData>(1, 'sign-in', (client, data) => {
    if(client instanceof ServerClient) {
        console.log(`Handling sign in`)
        console.log(client.socket.user)

        client.sendSuccessResponse(1, 'sign-in-success', {token: "123"})
        client.sendSuccessResponse(1, 'sign-in-failure',)
    }
})







