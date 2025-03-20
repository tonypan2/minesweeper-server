import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { GameState } from "../../Types";
import { INITIAL_STATE, makeMines, reveal } from "./mineUtils";
import puppeteer from "puppeteer";
import { gameCache, GAME_CACHE_KEY } from "../GameStateCache";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  let gameState = gameCache.get(GAME_CACHE_KEY) as GameState | undefined;
  if (gameState === undefined || searchParams.get("new") != null) {
    gameState = INITIAL_STATE;
  } else {
    const revealParam = searchParams.get("reveal");
    const flagParam = searchParams.get("flag");
    const unflagParam = searchParams.get("unflag");

    const posParam = searchParams.get("pos");
    let row;
    let col;
    if (posParam != null) {
      const parts = posParam.split(",");
      row = parseInt(parts[0], 10);
      col = parseInt(parts[1], 10);

      if (
        row < 0 ||
        row >= gameState.height ||
        col < 0 ||
        col >= gameState.width
      ) {
        return NextResponse.json(
          { error: "Position out of bounds" },
          { status: 400 }
        );
      }
    }

    if (
      (revealParam != null || flagParam != null || unflagParam != null) &&
      (row === undefined || col === undefined)
    ) {
      return NextResponse.json({ error: "Position expected" }, { status: 400 });
    }

    if (revealParam != null) {
      if (gameState.mines === undefined) {
        const newMines = makeMines(
          gameState.height,
          gameState.width,
          gameState.difficulty,
          row as number,
          col as number
        );

        gameState.mines = newMines;
      }

      if (gameState.mines[row as number][col as number]) {
        gameState.revealed[row as number][col as number] = true;
      }

      reveal(
        row as number,
        col as number,
        gameState.height,
        gameState.width,
        gameState.revealed,
        gameState.mines
      );
    } else if (flagParam != null) {
      gameState.flags[row as number][col as number] = true;
    } else if (unflagParam != null) {
      gameState.flags[row as number][col as number] = false;
    }
  }

  gameCache.set(GAME_CACHE_KEY, gameState);

  const url = new URL("http://localhost:5000");
  url.searchParams.set("state", JSON.stringify(gameState));

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 360, height: 360 });

  await page.goto(url.toString(), { waitUntil: "domcontentloaded" });
  const body = await page.$("body");
  if (body == null) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
  const image = await body.screenshot();
  await browser.close();

  const response = new NextResponse(image);
  response.headers.set("content-type", "image/png");
  return response;
}
