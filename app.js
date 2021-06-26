const start = document.querySelector("#start");
const GRID = document.querySelector(".grid");
const resetBtn = document.querySelector(".reset");
const pauseBtn = document.querySelector(".pause");
const count = document.querySelector(".count");

let genCount = 0;

let cellSize = Number(document.querySelector("#cell-size").value);
const gridW = GRID.offsetWidth;
const gridH = GRID.offsetHeight;
let cols = Math.floor(gridW / cellSize);
let rows = Math.floor(gridH / cellSize);

const randInt = (max, min) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const randColor = (col1, col2) => {
  if (col1 && col2) {
    return [col1, col2][randInt(0, 2)];
  }
  return `rgb(${randInt(0, 256)},${randInt(0, 256)},${randInt(0, 256)})`;
};

class Cell {
  constructor(size) {
    this.size = size;
    this.isAlive = false;
    this.html;
    this.liveNeighbours;
  }

  die() {
    this.isAlive = false;
    this.html.style.background = "#fff";
  }
  live() {
    this.isAlive = true;
    this.html.style.background = "#000";
  }

  getLiveNeighbours() {
    return this.liveNeighbours.length;
  }

  makeCell() {
    const cell = document.createElement("div");
    cell.style.display = "inline-block";
    cell.style.outline = "1px solid #aaa";
    cell.style.width = `${this.size}px`;
    cell.style.height = `${this.size}px`;
    cell.style.background = this.isAlive ? "#28eb96" : "#37303d";
    return cell;
  }
}

const initGridCells = () => {
  const grid = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      const cell = new Cell(cellSize);
      cell.isAlive = Boolean(randInt(0, 2));
      row.push(cell);
    }
    grid.push(row);
  }
  return grid;
};

const drawGrid = (grid) => {
  GRID.innerHTML = "";
  for (let i = 0; i < rows; i++) {
    const rowDiv = document.createElement("div");
    rowDiv.style.display = "flex";
    for (let j = 0; j < cols; j++) {
      const cell = grid[i][j];
      const cellDiv = cell.makeCell();
      cell.html = cellDiv;
      rowDiv.appendChild(cellDiv);
    }
    GRID.appendChild(rowDiv);
  }
};

const getemptyCells = () => {
  const grid = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push(null);
    }
    grid.push(row);
  }
  return grid;
};

const getAliveNeighboursArray = (arr, i, j) => {
  let liveNeighbours = 0;
  for (let k = -1; k < 2; k++) {
    if (arr[i + k]) {
      for (let l = -1; l < 2; l++) {
        if (
          arr[i + k][j + l] &&
          arr[i + k][j + l].isAlive &&
          arr[i + k][j + l] != arr[i][j]
        ) {
          liveNeighbours++;
        }
      }
    }
  }
  return liveNeighbours;
};

const setAliveNeighbours = (arr) => {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cell = arr[i][j];
      cell.liveNeighbours = getAliveNeighboursArray(arr, i, j);
    }
  }
};

const getNextGenrationArray = (oldArr) => {
  const newArr = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      const oldCell = oldArr[i][j];
      let newCell = new Cell(cellSize);
      const neighbours = oldCell.liveNeighbours;
      if (oldCell.isAlive) {
        if (neighbours < 2 || neighbours > 3) {
          newCell.isAlive = false;
        }
        if (neighbours == 2 || neighbours == 3) {
          newCell.isAlive = true;
        }
      } else {
        if (neighbours == 3) {
          newCell.isAlive = true;
        }
      }
      row.push(newCell);
    }
    newArr.push(row);
  }
  return newArr;
};

const drawNextGen = () => {
  count.textContent = `Gen Count: ${genCount++}`;
  let nextGen = getNextGenrationArray(cells1);
  setAliveNeighbours(nextGen);
  drawGrid(nextGen);
  cells1 = nextGen;
};

let cells1 = initGridCells();
const setup = () => {
  count.textContent = `Gen Count: ${genCount}`;
  cellSize = Number(document.querySelector("#cell-size").value);
  const gridW = GRID.offsetWidth;
  const gridH = GRID.offsetHeight;
  cols = Math.floor(gridW / cellSize);
  rows = Math.floor(gridH / cellSize);
};

const reset = () => {
  genCount = 0;
  setup();
  cells1 = initGridCells();
  displayGrid();
};

const displayGrid = () => {
  setAliveNeighbours(cells1);
  drawGrid(cells1);
};

setup();
displayGrid();

let isPaused = true;
pauseBtn.classList.replace("pause", "resume");
let interval;

resetBtn.addEventListener("click", reset);
pauseBtn.addEventListener("click", () => {
  if (isPaused) {
    interval = setInterval(drawNextGen, 50);
    isPaused = false;
    pauseBtn.classList.replace("resume", "pause");
  } else {
    clearInterval(interval);
    pauseBtn.classList.replace("pause", "resume");
    isPaused = true;
  }
});
