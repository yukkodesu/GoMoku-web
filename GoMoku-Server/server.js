const express = require('express');
const SocketServer = require("ws").Server;
const sha256 = require('crypto-js/sha256');
const hmacSHA512 = require('crypto-js/hmac-sha512');
const Base64 = require('crypto-js/enc-base64');
const { v4: uuidv4 } = require('uuid');


const app = express();
const server = app.listen("5050");
const wss = new SocketServer({ server });
const privateKey = uuidv4();


const waitingUser = [];
const userMap = new Map();
const stateMap = new Map();


wss.on("connection", ws => {
    ws.on('close', () => {
        console.log("A User Disconnected");
        const index = waitingUser.indexOf(ws);
        if (index !== -1) {
            waitingUser.splice(index, 1);
        }
        const user2 = userMap.get(ws);
        if (user2) {
            stateMap.delete(user2);
            userMap.delete(user2);
            user2.close();
        }
        stateMap.delete(ws);
        userMap.delete(ws);
    })
    ws.on('message', (data) => {
        const prevState = stateMap.get(ws);
        if (!prevState) {
            console.log("A User Connected");
            const playerName = data.toString();
            const userid = uuidv4();
            const hashDigest = sha256(userid);
            const signature = Base64.stringify(hmacSHA512(hashDigest, privateKey));
            waitingUser.push(ws);
            const newState = {
                type: "waiting",
                playerName,
                anotherPlayerName: "",
                role: "",
                boardArr: new Array(100).fill(0),
                userid,
                signature,
            };
            stateMap.set(ws, newState);
            ws.send(JSON.stringify(newState));
            if (waitingUser.length >= 2) {
                const [user1, user2] = waitingUser.splice(0, 2);
                userMap.set(user1, user2);
                userMap.set(user2, user1);
                const state1 = stateMap.get(user1);
                const state2 = stateMap.get(user2);
                state1.anotherPlayerName = state2.playerName;
                state2.anotherPlayerName = state1.playerName;
                const rand = Math.random();
                state1.role = rand < 0.5 ? "white" : "black";
                state2.role = rand < 0.5 ? "black" : "white";
                state1.type = "black";
                state2.type = "black";
                user1.send(JSON.stringify(state1));
                user2.send(JSON.stringify(state2));
            }
            return;
        }
        if (prevState.type === "white" || prevState.type === "black") {
            const user1 = ws;
            const user2 = userMap.get(user1);
            const state1 = stateMap.get(user1);
            const state2 = stateMap.get(user2);
            const { index: indexStr, userid, signature } = JSON.parse(data);
            // console.log(JSON.parse(data));
            if (!indexStr || !userid || !signature) {
                console.log("Request Parse Err");
                return;
            }
            const index = parseInt(indexStr);
            const hashDigest = sha256(userid);
            const signatureCheck = Base64.stringify(hmacSHA512(hashDigest, privateKey));
            if (signatureCheck !== signature) {
                console.log("Check Sum Err")
                return;
            }
            if (state1.boardArr[index] !== 0 || state1.role !== state1.type) return;
            state1.boardArr[index] = state1.role === 'white' ? 1 : 2;
            state2.boardArr[index] = state1.boardArr[index];
            state1.type = prevState.type === "white" ? "black" : "white";
            state2.type = state1.type;
            user1.send(JSON.stringify(state1));
            user2.send(JSON.stringify(state2));
            return;
        }
    });
})