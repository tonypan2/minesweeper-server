export enum GameDifficulty {
  Easy,
  Medium,
  Hard,
}
export interface GameState {
  height: number;
  width: number;
  difficulty: GameDifficulty;
  mines?: boolean[][];
  revealed: boolean[][];
  flags: boolean[][];
}
