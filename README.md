# Conway's Life Game (64x64)

A browser-based Conway's Game of Life simulation built with plain HTML, CSS, and JavaScript.
The board is a 64x64 toroidal grid, so cells on opposite edges are neighbors.
The app runs without a build step or external dependencies.

## Features

- Randomized initialization with about one-third of cells alive
- Five randomly placed gliders
- Three randomly placed galaxy patterns
- Manual cell toggling by clicking the board
- Start, stop, and single-step controls
- Speed adjustment from 1 to 60 frames per second
- Generation counter displayed at the bottom of the page

## Usage

Open `index.html` directly in a browser, or run a local static server from this directory:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

To stop the server, press `Ctrl+C` in the terminal.

### Controls

- **Random**: fills the grid with a random pattern
- **Gliders**: creates five gliders in random positions
- **galaxies**: creates three galaxy patterns in non-overlapping random positions
- **Clear**: resets the board to empty
- **Start** / **Stop**: begin or pause simulation
- **Step**: advances one generation
- **Speed**: changes the update rate from 1 to 60 frames per second
- **Click cells**: toggles alive/dead state manually

## Deploying to GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repository settings, open **Pages**.
3. Set the source to the branch containing the project and the root folder (`/`).
4. The site will be published at `https://<username>.github.io/<repo>/`.
