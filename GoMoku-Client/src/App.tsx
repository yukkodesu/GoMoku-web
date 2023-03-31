import { useEffect, useState } from "react";
import "./App.css";
import Board from "./components/board/board";

interface State {
  type: string;
  bordArr: Array<number>;
  userid: string;
  signature: string;
}

function App() {
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5050");
    ws.onmessage = (ev) => {
      console.log(ev.data);
    };
  }, []);
  const [state, setState] = useState();
  return (
    <div className="App">
      <header>
        <h1>GoMoku</h1>
        <div>
          <h2>Waiting Another Player</h2>
        </div>
      </header>
      <Board />
    </div>
  );
}

export default App;
