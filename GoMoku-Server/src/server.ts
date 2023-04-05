import express from "express";
import { Server as SocketServer, WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";
import { RawData } from "ws";

const app = express();
const server = app.listen("5050");
const wss = new SocketServer({ server });

const waitingUser: Array<WebSocket> = [];
const userMap = new Map<WebSocket, WebSocket>();
const stateMap = new Map<WebSocket, State>();

interface State {
  type: string;
  playerName: string;
  anotherPlayerName: string;
  role: string;
  boardArr: Array<number>;
  userid: string;
}

wss.on("connection", (ws) => {
  ws.on("close", () => onUserConnect(ws));
  ws.on("message", (data) => onStateChange(ws, data));
});

const onUserConnect = (ws: WebSocket) => {
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
};

const onStateChange = (ws: WebSocket, data: RawData) => {
  const prevState = stateMap.get(ws);

  //init State
  if (!prevState) {
    console.log("A User Connected");
    const playerName = data.toString();
    waitingUser.push(ws);
    const newState: State = {
      type: "waiting",
      playerName,
      anotherPlayerName: "",
      role: "",
      boardArr: new Array(100).fill(0),
      userid: uuidv4(),
    };
    stateMap.set(ws, newState);
    ws.send(JSON.stringify(newState));

    if (waitingUser.length >= 2) {
      joinTwoPlayer();
    }
    return;
  }

  // Playing State
  if (prevState.type === "white" || prevState.type === "black") {
    const user1 = ws;
    const user2 = userMap.get(user1);
    if (!user2) {
      console.error("Internal Err");
      ws.close();
      return;
    }
    const { state1, state2 } = getState(user1, user2);
    const { index: indexStr, userid } = JSON.parse(data.toString());

    if (!indexStr || !userid) {
      console.error("Request Parse Err");
      return;
    }
    const move = parseInt(indexStr);
    switchType(state1, state2, prevState, move);
    user1.send(JSON.stringify(state1));
    user2.send(JSON.stringify(state2));
    return;
  }
};

const getState = function (
  user1: WebSocket,
  user2: WebSocket
): { state1: State; state2: State } {
  const state1 = stateMap.get(user1),
    state2 = stateMap.get(user2);
  if (!state1 || !state2) throw Error("A Player State is Null!");
  return { state1, state2 };
};

const switchType = function (
  state1: State,
  state2: State,
  prevState: State,
  move: number
) {
  if (state1.boardArr[move] !== 0 || state1.role !== state1.type) return;
  state1.boardArr[move] = state1.role === "white" ? 1 : 2;
  state2.boardArr[move] = state1.boardArr[move];
  const isWinning = checkWinning(state1.boardArr);
  if (isWinning) {
    const winner = isWinning === 1 ? "white" : "black";
    state1.type = winner === state1.role ? "winning" : "lost";
    state2.type = winner === state2.role ? "winning" : "lost";
    return;
  }
  state1.type = prevState.type === "white" ? "black" : "white";
  state2.type = state1.type;
};

const joinTwoPlayer = function () {
  const [user1, user2] = waitingUser.splice(0, 2);
  userMap.set(user1, user2);
  userMap.set(user2, user1);
  const { state1, state2 } = getState(user1, user2);
  const rand = Math.random();
  const newState1 = {
    ...state1,
    type: "black",
    role: rand < 0.5 ? "white" : "black",
    anotherPlayerName: state2.playerName,
  };
  const newState2 = {
    ...state2,
    type: "black",
    role: rand < 0.5 ? "black" : "white",
    anotherPlayerName: state1.playerName,
  };
  stateMap.set(user1, newState1);
  stateMap.set(user2, newState2);

  user1.send(JSON.stringify(newState1));
  user2.send(JSON.stringify(newState2));
};

const checkWinning = function (board: Array<number>): number {
  const vec = [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1],
  ];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const index = i * 10 + j;
      if (board[index] === 0) continue;

      for (let k = 0; k < vec.length; k++) {
        let x = i,
          y = j;
        let cnt = 0;
        while (x < 10 && y < 10 && x >= 0 && y >= 0) {
          x += vec[k][0];
          y += vec[k][1];
          if (board[x * 10 + y] !== board[index]) break;
          cnt++;
        }
        x = i;
        y = j;
        while (x < 10 && y < 10 && x >= 0 && y >= 0) {
          x -= vec[k][0];
          y -= vec[k][1];
          if (board[x * 10 + y] !== board[index]) break;
          cnt++;
        }
        if (cnt + 1 >= 5) return board[index];
      }
    }
  }
  return 0;
};
