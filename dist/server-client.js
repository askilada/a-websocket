"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ServerClient {
    constructor(id, socket, server) {
        this.id = id;
        this.socket = socket;
        this.server = server;
        this.errorCount = 0;
        this.handleIncomingMessage = (msg) => {
            try {
                const data = JSON.parse(msg);
                if ((data.hasOwnProperty('op') || data.hasOwnProperty('action')) === false) {
                    return this.sendErrorResponse("Invalid request");
                }
                this.logMessage(false, data.op, data.action);
                this.server.messageHandler.run(data.op, data.action, this, data.data);
            }
            catch (e) {
                this.sendErrorResponse(e.message);
            }
        };
        this.sendErrorResponse = (message) => {
            console.error("-> [E]\t", message);
            this.errorCount++;
            if (this.errorCount >= 3) {
                this.socket.close();
            }
        };
        this.logMessage = (sending, op, action, data = {}) => {
            const arrow = sending ? "->" : "<-";
            const opString = op.toString().padStart(4, ' ');
            const actionString = action.padStart(25, ' ');
            const text = [];
            text.push(`| ${arrow} `);
            text.push(` ${this.id.substr(this.id.length - 16, 16)} `);
            text.push(` ${opString} `);
            text.push(` ${actionString} |`);
            console.log(text.join(`|`), JSON.stringify(data));
        };
        this.sendSuccessResponse = (op, action, data) => {
            this.logMessage(true, op, action, data);
            const responseData = JSON.stringify({
                op,
                action,
                data
            });
            this.socket.send(responseData);
        };
        socket.on('close', () => {
            server.removeConnection(id);
        });
        socket.on('message', this.handleIncomingMessage);
    }
}
exports.ServerClient = ServerClient;
