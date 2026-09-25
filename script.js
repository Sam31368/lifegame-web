(function () {
  const SIZE = 64;
  const CANVAS_PX = 360;
  const CELL_PX = CANVAS_PX / SIZE;

  const board = document.getElementById('board');
  const ctx = board.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  // Off-screen 1px-per-cell buffer, scaled up when drawn to the visible canvas.
  const off = document.createElement('canvas');
  off.width = SIZE;
  off.height = SIZE;
  const offCtx = off.getContext('2d');
  const imageData = offCtx.createImageData(SIZE, SIZE);

  let grid = new Uint8Array(SIZE * SIZE);
  let nextGrid = new Uint8Array(SIZE * SIZE);
  let generation = 0;
  let running = false;
  let timerId = null;
  let fps = 10;

  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const stepBtn = document.getElementById('stepBtn');
  const initSelect = document.getElementById('initSelect');
  const clearBtn = document.getElementById('clearBtn');
  const speedSlider = document.getElementById('speedSlider');
  const speedValue = document.getElementById('speedValue');
  const genCounter = document.getElementById('genCounter');

  function idx(x, y) {
    return y * SIZE + x;
  }

  function countNeighbors(x, y) {
    let count = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = (x + dx + SIZE) % SIZE;
        const ny = (y + dy + SIZE) % SIZE;
        count += grid[idx(nx, ny)];
      }
    }
    return count;
  }

  function step() {
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const alive = grid[idx(x, y)];
        const n = countNeighbors(x, y);
        nextGrid[idx(x, y)] = alive ? (n === 2 || n === 3 ? 1 : 0) : (n === 3 ? 1 : 0);
      }
    }
    [grid, nextGrid] = [nextGrid, grid];
    generation++;
    updateGenCounter();
    render();
  }

  function render() {
    const data = imageData.data;
    for (let i = 0; i < grid.length; i++) {
      const alive = grid[i];
      const o = i * 4;
      const v = alive ? 255 : 0;
      data[o] = v;
      data[o + 1] = v;
      data[o + 2] = v;
      data[o + 3] = 255;
    }
    offCtx.putImageData(imageData, 0, 0);
    ctx.clearRect(0, 0, CANVAS_PX, CANVAS_PX);
    ctx.drawImage(off, 0, 0, CANVAS_PX, CANVAS_PX);
  }

  function updateGenCounter() {
    genCounter.textContent = `Generation: ${generation}`;
  }

  function setCell(x, y, value) {
    if (x < 0 || x >= SIZE || y < 0 || y >= SIZE) return;
    grid[idx(x, y)] = value ? 1 : 0;
  }

  function addGlider(x, y, rotation = 0) {
    const cells = [
      [0, 1, 0],
      [0, 0, 1],
      [1, 1, 1],
    ];

    for (let row = 0; row < cells.length; row++) {
      for (let col = 0; col < cells[row].length; col++) {
        if (!cells[row][col]) continue;

        let px = col;
        let py = row;

        for (let r = 0; r < rotation; r += 90) {
          const nx = py;
          const ny = 2 - px;
          px = nx;
          py = ny;
        }

        setCell(x + px, y + py, 1);
      }
    }
  }

  function randomize() {
    for (let i = 0; i < grid.length; i++) {
      grid[i] = Math.random() < 1 / 3 ? 1 : 0;
    }

    generation = 0;
    updateGenCounter();
    render();
  }

  function addGliders() {
    grid.fill(0);

    for (let i = 0; i < 5; i++) {
      const x = 2 + Math.floor(Math.random() * (SIZE - 8));
      const y = 2 + Math.floor(Math.random() * (SIZE - 8));
      const rotation = Math.floor(Math.random() * 4) * 90;
      addGlider(x, y, rotation);
    }

    generation = 0;
    updateGenCounter();
    render();
  }

  function addGalaxies() {
    grid.fill(0);

    const pattern = [
      [1,1,1,1,1,1,0,1,1],
      [1,1,1,1,1,1,0,1,1],
      [0,0,0,0,0,0,0,1,1],
      [1,1,0,0,0,0,0,1,1],
      [1,1,0,0,0,0,0,1,1],
      [1,1,0,0,0,0,0,1,1],
      [1,1,0,0,0,0,0,0,0],
      [1,1,0,1,1,1,1,1,1],
      [1,1,0,1,1,1,1,1,1]
    ];

    const positions = [];
    const patternWidth = pattern[0].length;
    const patternHeight = pattern.length;
    const minX = Math.floor(0.1 * SIZE);
    const minY = Math.floor(0.1 * SIZE);
    const maxX = Math.floor(0.9 * SIZE - patternWidth);
    const maxY = Math.floor(0.9 * SIZE - patternHeight);

    while (positions.length < 3) {
      const x = minX + Math.floor(Math.random() * (maxX - minX + 1));
      const y = minY + Math.floor(Math.random() * (maxY - minY + 1));

      const overlaps = positions.some((position) => (
        x < position.x + patternWidth &&
        x + patternWidth > position.x &&
        y < position.y + patternHeight &&
        y + patternHeight > position.y
      ));

      if (!overlaps) positions.push({ x, y });
    }

    for (const position of positions) {
      for (let y = 0; y < patternHeight; y++) {
        for (let x = 0; x < patternWidth; x++) {
          if (pattern[y][x]) {
            setCell(position.x + x, position.y + y, 1);
          }
        }
      }
    }

    generation = 0;
    updateGenCounter();
    render();
  }

  function clearGrid() {
    grid.fill(0);
    generation = 0;
    updateGenCounter();
    render();
  }

  function scheduleNext() {
    timerId = setTimeout(() => {
      step();
      if (running) scheduleNext();
    }, 1000 / fps);
  }

  function start() {
    if (running) return;
    running = true;
    scheduleNext();
  }

  function stop() {
    running = false;
    if (timerId !== null) {
      clearTimeout(timerId);
      timerId = null;
    }
  }

  function toggleCellAtEvent(evt) {
    const rect = board.getBoundingClientRect();
    const x = Math.floor(((evt.clientX - rect.left) / rect.width) * SIZE);
    const y = Math.floor(((evt.clientY - rect.top) / rect.height) * SIZE);
    if (x < 0 || x >= SIZE || y < 0 || y >= SIZE) return;
    const i = idx(x, y);
    grid[i] = grid[i] ? 0 : 1;
    render();
  }

  board.addEventListener('click', toggleCellAtEvent);

  startBtn.addEventListener('click', start);
  stopBtn.addEventListener('click', stop);
  stepBtn.addEventListener('click', () => {
    stop();
    step();
  });
  initSelect.addEventListener('change', () => {
    stop();

    switch (initSelect.value) {
      case 'random':
        randomize();
        break;
      case 'glider':
        addGliders();
        break;
      case 'galaxy':
        addGalaxies();
        break;
      default:
        break;
    }
  });
  clearBtn.addEventListener('click', () => {
    stop();
    clearGrid();
  });
  speedSlider.addEventListener('input', () => {
    fps = Number(speedSlider.value);
    speedValue.textContent = String(fps);
  });

  randomize();
})();
