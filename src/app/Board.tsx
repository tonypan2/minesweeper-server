import { ReactElement, useMemo } from "react";
import type { GameState } from "./Types";
import { countNeighborMines } from "./api/play/mineUtils";
import Cell from "./Cell";

export default function Board({
  height,
  width,
  mines,
  revealed,
  flags,
}: Omit<GameState, "difficulty">) {
  const gameResult: "win" | "lose" | undefined = useMemo(() => {
    let unflaggedMines = 0;
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (mines?.[i][j]) {
          if (revealed[i][j]) {
            return "lose";
          }

          if (!flags[i][j]) {
            unflaggedMines++;
          }
        }
      }
    }

    if (mines != null && unflaggedMines === 0) {
      return "win";
    }
  }, [height, width, revealed, mines, flags]);

  const rows = new Array<ReactElement<typeof Cell>[]>(height);
  for (let i = 0; i < height; i++) {
    rows[i] = [];
    for (let j = 0; j < width; j++) {
      rows[i].push(
        <Cell
          key={`cell-${i.toString()}-${j.toString()}`}
          neighborMines={
            mines ? countNeighborMines(i, j, height, width, mines) : undefined
          }
          isRevealed={revealed[i][j]}
          isFlagged={flags[i][j]}
          hasMine={mines?.[i][j]}
          isDisabled={gameResult !== undefined}
        />
      );
    }
  }

  return (
    <div className="flex relative mx-auto">
      {gameResult != null && (
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-cyan-200 text-6xl font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
            {gameResult === "win" ? "You win!" : "You lose!"}
          </h2>
        </div>
      )}
      <div>
        {rows.map((row, i) => {
          return (
            <div className="flex" key={`row-${i.toString()}`}>
              {row}
            </div>
          );
        })}
      </div>
    </div>
  );
}
