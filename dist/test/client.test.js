"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
const WebSocket = require("ws");
const ws = new WebSocket("ws://localhost:5001");
const client = new __1.Client(ws);
