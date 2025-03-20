import NodeCache from "node-cache";

export const gameCache = new NodeCache({ stdTTL: 0 });

export const GAME_CACHE_KEY = "MY_GAME_KEY";
