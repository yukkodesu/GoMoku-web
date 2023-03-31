const express = require('express');
const SocketServer = require("ws").Server;
const app = express();

const server = app.listen("5050");

const wss = new SocketServer({ server });

const user = [];

wss.on("connection", ws => {
    console.log("Client connected");
    ws.send("hello from server");
    // user.push(ws);
})