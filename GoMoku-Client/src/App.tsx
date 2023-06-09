import { MouseEventHandler, useEffect, useRef, useState } from "react";
import "./App.css";
import Board from "./components/board/board";
import createConfetti from "./utils/confetti";

interface State {
  type: string;
  playerName: string;
  anotherPlayerName: string;
  role: string;
  boardArr: Array<number>;
  userid: string;
}

function App() {
  const wsRef = useRef<WebSocket | undefined>(undefined);
  const [state, setState] = useState<State | undefined>(undefined);
  // console.log(state);

  useEffect(() => {
    if (state?.type === "winning") {
      createConfetti();
    }
  }, [state]);

  const handleClick: MouseEventHandler = function (e) {
    if (e.target instanceof HTMLImageElement) {
      const indexStr = e.target.dataset.index;
      if (!indexStr || !wsRef.current || !state) return;
      wsRef.current.send(
        JSON.stringify({
          index: indexStr,
          userid: state.userid,
        })
      );
    }
  };

  const startGame = function () {
    resetGame();
    const playerName = prompt("Enter Your Name");
    const ws = new WebSocket("ws://localhost:5173/api");
    wsRef.current = ws;
    ws.onopen = () => {
      ws.send(playerName ?? "player_random");
    };
    ws.onmessage = (ev) => {
      const stateParsed = JSON.parse(ev.data);
      if (stateParsed) {
        console.log(stateParsed);
        setState(stateParsed);
      }
    };
    ws.onclose = () => {
      setState(undefined);
      alert("A Player has Disconnected");
    };
  };

  const resetGame = function () {
    if (wsRef.current) {
      wsRef.current.close();
    }
    wsRef.current = undefined;
    setState(undefined);
  };

  return (
    <div className="App">
      <header>
        <h1>GoMoku</h1>
        <div>
          <div style={{ padding: "10px 0" }}>
            <button
              style={{ padding: "5px" }}
              disabled={state && state?.type !== ""}
              onClick={startGame}
            >
              Play
            </button>
            <button
              style={{ padding: "5px", marginLeft: "20px" }}
              onClick={resetGame}
            >
              Reset
            </button>
          </div>
          {state && (
            <div className="container">
              <div className="player-info">
                <p>Player1 :{state?.playerName}</p>
              </div>
              <div className="player-info">
                <p>
                  Player2 :
                  {state?.anotherPlayerName && state?.anotherPlayerName !== ""
                    ? state?.anotherPlayerName
                    : "Waiting"}
                </p>
              </div>
            </div>
          )}
          {state?.type === "waiting" && <h2>Waiting Player2</h2>}
          {state?.type === "white" || state?.type === "black" ? (
            state?.type === state?.role ? (
              <h2>Your Turn</h2>
            ) : (
              <h2>Waiting Player2 Movement</h2>
            )
          ) : null}
          {state?.type === "winning" || state?.type === "lost" ? (
            state?.type === "winning" ? (
              <h2>You Win!</h2>
            ) : (
              <h2>You Lost</h2>
            )
          ) : null}
        </div>
      </header>
      <Board boardArr={state?.boardArr} onClick={handleClick} />
    </div>
  );
}

export default App;
