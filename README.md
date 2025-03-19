# Minesweeper Server

This is a server that hosts a game of [Minesweeper](<https://en.wikipedia.org/wiki/Minesweeper_(video_game)>). The game is played by making API calls to the server, which returns the game state as an image. This is useful for AI agents who can interact with the game programmatically.

For example, the game can be played like this:

- `GET /api/play?new`

  ![Screenshot of game play](static/new.png?raw=true)

- `GET /api/play?reveal&pos=2,6`

  ![Screenshot of game play](static/unflag.png?raw=true)

- `GET /api/play?flag&pos=0,3`

  ![Screenshot of game play](static/flag.png?raw=true)

When the game is finished, the image will indicate the result:

![Screenshot of game play](static/lose.png?raw=true)

## Architecture

The server consists of two parts:

- A: Server-side-rendered, stateless game UI
- B: API endpoints that:
  - Maintain the game state
  - Generate image representations of the game by using [Puppeteer](https://pptr.dev/) to render the UI served by `Part A`.

## Getting Started

```bash
npm install
npm run dev
```

The server will be running at:

- [http://localhost:5000](http://localhost:5000) for the UI
- [http://localhost:5000/api/play](http://localhost:5000/api/play) for the API

## API

- `GET /api/play?new`: Create a new game, overwriting any ongoing game.
- `GET /api/play?reveal&pos=<row>,<col>`: Reveal the cell at `(row, col)`
- `GET /api/play?flag&pos=<row>,<col>`: Flag the cell at `(row, col)`
- `GET /api/play?unflag&pos=<row>,<col>`: Unflag the cell at `(row, col)`
