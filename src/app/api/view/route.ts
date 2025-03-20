import { gameCache, GAME_CACHE_KEY } from "../GameStateCache";
import { GameState } from "../../Types";
import { NextResponse } from "next/server";

export async function GET() {
  const gameState = gameCache.get(GAME_CACHE_KEY) as GameState | undefined;
  return NextResponse.json({ gameState });
}
