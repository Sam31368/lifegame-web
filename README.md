# Life Game (64x64)

A browser-based Conway's Game of Life simulation built with plain HTML, CSS, and JavaScript.
The board is a 64x64 toroidal grid, and the app runs without any build step.

## Features

- Randomized initialization with about one-third of cells alive
- Five randomly placed gliders
- Manual cell toggling by clicking the board
- Start, stop, and single-step controls
- Speed adjustment via slider
- Generation counter displayed at the bottom of the page

## Usage

Open `index.html` directly in a browser, or run a local static server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

### Controls

- **Random**: fills the grid with a random pattern
- **Gliders**: creates five gliders in random positions
- **Clear**: resets the board to empty
- **Start** / **Stop**: begin or pause simulation
- **Step**: advances one generation
- **Speed**: changes the update rate in frames per second
- **Click cells**: toggles alive/dead state manually

## Deploying to GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repository settings, open **Pages**.
3. Set the source to the `master` branch and the root folder (`/`).
4. The site will be published at `https://<username>.github.io/<repo>/`.
