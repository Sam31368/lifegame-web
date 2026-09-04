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
  const randomBtn = document.getElementById('randomBtn');
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
      const v = alive ? 230 : 17;
      data[o] = v;
      data[o + 1] = alive ? 230 : 17;
      data[o + 2] = alive ? 230 : 24;
      data[o + 3] = 255;
    }
    offCtx.putImageData(imageData, 0, 0);
    ctx.clearRect(0, 0, CANVAS_PX, CANVAS_PX);
    ctx.drawImage(off, 0, 0, CANVAS_PX, CANVAS_PX);
  }

  function updateGenCounter() {
    genCounter.textContent = `Generation: ${generation}`;
  }

  function randomize() {
    for (let i = 0; i < grid.length; i++) {
      grid[i] = Math.random() < 0.3 ? 1 : 0;
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
  randomBtn.addEventListener('click', () => {
    stop();
    randomize();
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
