import Board from "./Board";
import type { GameState } from "./Types";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  let state: GameState | undefined;
  if (params["state"] != null) {
    state = JSON.parse(params["state"] as string);
  }

  if (state == null) {
    return <>Please provide game state</>;
  }

  const { height, width, mines, revealed, flags } = state;
  return (
    <Board
      height={height}
      width={width}
      mines={mines}
      revealed={revealed}
      flags={flags}
    />
  );
}
