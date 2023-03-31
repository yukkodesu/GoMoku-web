import noStone from "../../assets/noStone.webp";
import blackStone from "../../assets/blackStone.webp";
import whiteStone from "../../assets/whiteStone.webp";
import "./board.css";

interface Props {
  boardArr?: Array<number>;
}

function Board({ boardArr }: Props) {
  if (boardArr === undefined) {
    const result = [];
    for (let i = 1; i <= 10; i++) {
      for (let j = 1; j <= 10; j++) {
        result.push(
          <img
            key={(i - 1) * 10 + j}
            className="stone"
            src={noStone}
            style={{
              display: "inline-block",
              gridColumn: `${j}/${j + 1}`,
              gridRow: `${i}/${i + 1}`,
            }}
          />
        );
      }
    }
    return (
      <div className="board">
        {result}
      </div>
    );
  }
  return <></>;
}

export default Board;
