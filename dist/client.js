"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const message_handler_1 = require("./message-handler");
class Client {
    constructor(ws) {
        this.ws = ws;
        this.queueRunning = false;
        this.messageQueue = [];
        this.messageHandler = new message_handler_1.MessageHandler();
        this.log = (message) => {
            const messageA = [];
            messageA.push(" [Client] ".padStart(10, ' '));
            messageA.push(message.padStart(50, ' '));
            console.log(messageA.join('|'));
        };
        this.receiveMessage = (data) => {
            if (typeof data !== "string") {
                this.log("Message is not a string");
                return;
            }
            try {
                const jsonData = JSON.parse(data);
                if ((jsonData.hasOwnProperty('op') && jsonData.hasOwnProperty('action')) == false) {
                    throw new Error("Missing op or action");
                }
                //this.messageHandler.run(jsonData.op, jsonData.action, this, jsonData.data)
            }
            catch (e) {
                console.error(e);
                this.log(e.message);
            }
        };
        this.sendMessage = (op, action, data) => {
            this.addMessageToQueue(JSON.stringify({ op, action, data }));
        };
        this.addMessageToQueue = (message) => {
            this.messageQueue.push(message);
            if (!this.queueRunning) {
                this.startMessageQueue();
            }
        };
        this.startMessageQueue = () => {
            this.queueRunning = true;
            this.runMessageQueue();
        };
        this.runMessageQueue = () => {
            if (!this.queueRunning || this.ws.readyState !== this.ws.OPEN || this.messageQueue.length === 0) {
                setTimeout(this.runMessageQueue, 100);
                return;
            }
            const message = this.messageQueue.pop();
            console.log("Sending message", message);
            this.ws.send(message);
            setTimeout(this.runMessageQueue, 100);
        };
        this.ws.on('message', this.receiveMessage);
    }
}
exports.Client = Client;
