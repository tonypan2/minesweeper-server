"use client";

import { useState, useEffect } from "react";
import Board from "../Board";
import type { GameState } from "../Types";

export default function View() {
  const [gameState, setGameState] = useState<GameState | undefined>();
  const [tick, setTick] = useState(0);
  const [timer, setTimer] = useState<
    ReturnType<typeof setTimeout> | undefined
  >();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/view").then().catch();
        if (response.ok) {
          const json = await response.json();
          if (json.gameState != null) {
            setGameState(json.gameState);
          }
        } else {
          console.error(response.statusText);
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();

    if (timer != null) {
      clearTimeout(timer);
    }

    const timeout = setTimeout(() => {
      setTick((tick) => tick + 1);
    }, 1000);
    setTimer(timeout);

    // Intentionally only relying on tick to run this effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  if (gameState === undefined) {
    return (
      <div>
        No ongoing game.
        <p>
          Issue a GET to http://localhost:5000/api/play?new to start one. This
          page will refresh automatically.
        </p>
      </div>
    );
  }

  const { height, width, mines, revealed, flags } = gameState;
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
