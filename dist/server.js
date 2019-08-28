"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const server_client_1 = require("./server-client");
const message_handler_1 = require("./message-handler");
class Server {
    constructor(server) {
        this.server = server;
        this.clients = [];
        this.connectionMiddleware = [];
        this.messageHandler = new message_handler_1.MessageHandler();
        this.broadcast = (op, action, message) => {
            this.clients.forEach(client => {
                client.sendSuccessResponse(op, action, message);
            });
        };
        this.addConnectionMiddleware = (middleware) => {
            this.connectionMiddleware.push(middleware);
        };
        this.handleIncomingConnection = (ws, msg) => {
            crypto.randomBytes(10, (err, buf) => {
                if (err) {
                    console.error("Error while generate random bytes");
                    console.error(err);
                    ws.close(99);
                    return;
                }
                const id = crypto.createHash('sha1').update(buf).digest('hex');
                console.log('Connection ID:', id);
                const middlewares = [...this.connectionMiddleware];
                const newWs = middlewares.reduce((previousValue, currentValue, currentIndex) => {
                    return currentValue(ws, msg);
                }, ws);
                this.addConnection(new server_client_1.ServerClient(id, newWs, this));
            });
        };
        this.addConnection = (client) => {
            this.clients.push(client);
        };
        this.removeConnection = (clientId) => {
            this.clients = this.clients.filter(c => c.id !== clientId);
        };
        server.on('connection', this.handleIncomingConnection);
        // setInterval(() => {
        //     this.broadcast(0, 'time', Date.now())
        // }, 5000)
    }
}
exports.Server = Server;
