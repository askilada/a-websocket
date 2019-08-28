import {Client} from '../'
import * as WebSocket from 'ws'


const ws = new WebSocket("ws://localhost:5001")
const client = new Client(ws)
