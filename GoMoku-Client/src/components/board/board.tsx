import noStone from "../../assets/noStone.webp";
import blackStone from "../../assets/blackStone.webp";
import whiteStone from "../../assets/whiteStone.webp";
import "./board.css";
import { MouseEventHandler } from "react";

interface Props {
  boardArr?: Array<number>;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

function Board({ boardArr, onClick }: Props) {
  if (boardArr === undefined) {
    const result = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const index = i * 10 + j;
        result.push(
          <img
            key={index}
            data-index={index}
            className="stone"
            src={noStone}
            style={{
              display: "inline-block",
              gridColumn: `${j + 1}/${j + 2}`,
              gridRow: `${i + 1}/${i + 2}`,
            }}
          />
        );
      }
    }
    return (
      <div className="board" onClick={onClick}>
        {result}
      </div>
    );
  }
  return (
    <div className="board" onClick={onClick}>
      {boardArr.map((item, index) => {
        const i = Math.floor(index / 10);
        const j = index % 10;
        const imgSrc =
          item === 0 ? noStone : item === 1 ? whiteStone : blackStone;
        return (
          <img
            key={index}
            data-index={index}
            className="stone"
            src={imgSrc}
            style={{
              display: "inline-block",
              gridColumn: `${j + 1}/${j + 2}`,
              gridRow: `${i + 1}/${i + 2}`,
            }}
          />
        );
      })}
    </div>
  );
}

export default Board;
