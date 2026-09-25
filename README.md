# Conway's Life Game (64x64)

A browser-based Conway's Game of Life simulation built with plain HTML, CSS, and JavaScript.
The board is a 64x64 toroidal grid, so cells on opposite edges are neighbors.
The app runs without a build step or external dependencies.

## Features

- Randomized initialization with about one-third of cells alive
- Five randomly placed gliders
- Three galaxy patterns generated in non-overlapping positions inside the central 80% of the board
- Queen bee shuttle patterns centered horizontally at one-third and two-thirds of the board height, with the lower pattern mirrored
- Manual cell toggling by clicking the board
- Start, stop, and single-step controls
- Speed adjustment from 1 to 60 frames per second
- Generation counter displayed at the bottom of the page

## Usage

Run a local static server from this directory:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

To stop the server, press `Ctrl+C` in the terminal.

### Controls

- **Init dropdown**: choose one of the preset patterns: Random, Gliders, Galaxies, or Queen bee shuttle
- **Clear**: resets the board to empty
- **Start** / **Stop**: begin or pause simulation
- **Step**: advances one generation
- **Speed**: changes the update rate from 1 to 60 frames per second
- **Click cells**: toggles alive/dead state manually

The initialization selector is a compact dropdown menu to keep the top toolbar simple and visually clean while still providing all four preset starting patterns. The Queen bee shuttle uses two matrix-centered patterns: the upper pattern is centered at one-third of the board height, and the lower pattern is centered at two-thirds and mirrored horizontally.

## Deploying to GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repository settings, open **Pages**.
3. Set the source to the branch containing the project and the root folder (`/`).
4. The site will be published at `https://<username>.github.io/<repo>/`.
