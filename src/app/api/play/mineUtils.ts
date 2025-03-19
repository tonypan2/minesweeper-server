import { GameDifficulty, GameState } from "../../Types";

const INITIAL_STATE_HEIGHT = 9;
const INITIAL_STATE_WIDTH = 9;

function makeMatrix(height: number, width: number): boolean[][] {
  return Array.from({ length: height }, () =>
    Array.from({ length: width }, () => false)
  );
}

export const INITIAL_STATE: GameState = {
  height: INITIAL_STATE_HEIGHT,
  width: INITIAL_STATE_WIDTH,
  difficulty: GameDifficulty.Easy,
  // To avoid the player hitting the mine after the very first play (which wouldn't be very fun),
  // mines are only generated after the first play.
  mines: undefined,
  revealed: makeMatrix(INITIAL_STATE_HEIGHT, INITIAL_STATE_WIDTH),
  flags: makeMatrix(INITIAL_STATE_HEIGHT, INITIAL_STATE_WIDTH),
};

export function makeMines(
  height: number,
  width: number,
  difficulty: GameDifficulty,
  initialClickRow: number,
  initialClickCol: number
) {
  let mineRatio;
  switch (difficulty) {
    case GameDifficulty.Easy:
      mineRatio = 10 / 9 / 9;
      break;
    case GameDifficulty.Medium:
      mineRatio = 40 / 16 / 16;
      break;
    case GameDifficulty.Hard:
      mineRatio = 99 / 30 / 16;
      break;
  }

  const mineCount = Math.floor(height * width * mineRatio);
  const mines = new Set<string>();
  while (mines.size < mineCount) {
    const row = Math.floor(Math.random() * height);
    const col = Math.floor(Math.random() * width);
    const newMine = `${row.toString()},${col.toString()}`;
    if (
      !mines.has(newMine) &&
      (row !== initialClickRow || col !== initialClickCol)
    ) {
      mines.add(newMine);
    }
  }

  const mineMatrix = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => false)
  );

  for (const mine of mines) {
    const parts = mine.split(",");
    mineMatrix[parseInt(parts[0])][parseInt(parts[1])] = true;
  }

  return mineMatrix;
}

export function countNeighborMines(
  row: number,
  col: number,
  height: number,
  width: number,
  mines: boolean[][]
): number {
  let count = 0;

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const newRow = row + dx;
      const newCol = col + dy;

      if (newRow < 0 || newRow >= height || newCol < 0 || newCol >= width) {
        continue;
      }

      if (mines[newRow][newCol]) {
        count++;
      }
    }
  }

  return count;
}

export function reveal(
  row: number,
  col: number,
  height: number,
  width: number,
  revealed: boolean[][],
  mines: boolean[][]
) {
  if (row < 0 || row >= height || col < 0 || col >= width) {
    return;
  }

  if (revealed[row][col] || mines[row][col]) {
    return;
  }

  revealed[row][col] = true;

  if (countNeighborMines(row, col, height, width, mines) > 0) {
    return;
  }

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      reveal(row + dx, col + dy, height, width, revealed, mines);
    }
  }
}
