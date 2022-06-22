const seed = 0.9;

const blues = [
  "#0000ff",
  "#1010ff",
  "#2020ff",
  "#3030ff",
  "#4040ff",
  "#5050ff",
  "#6060ff",
  "#7070ff",
  "#8080ff",
  "#9090ff",
  "#a0a0ff",
].reverse();

const colors = "0123456789abcdef"
  .split("")
  .map((v) => "#" + v.repeat(4) + "ff");

class Cell {
  static width = 5;
  static height = 5;

  constructor(context, i, j) {
    this.context = context;

    this.i = i;
    this.j = j;

    this.alive = Math.random() > seed;
    this.age = 0;
    this.nextAlive;
  }

  draw() {
    let index = Math.floor(Math.log(this.age));
    this.color = blues[index >= blues.length ? blues.length - 1 : index];
    this.context.fillStyle = this.alive ? "#8080ff" : "#303030";
    if (this.alive) {
      this.context.beginPath();
      this.context.arc(
        this.j * Cell.width,
        this.i * Cell.height,
        Cell.width / 2,
        0,
        2 * Math.PI
      );
      this.context.fill();
    }
  }
}

class GameOfLife {
  constructor() {
    this.width = canvas.width / Cell.width;
    this.height = canvas.height / Cell.height;
    this.ctx = canvas.getContext("2d");

    this.grid = [];
    for (let i = 0; i < this.height; i++) {
      this.grid.push([]);
      for (let j = 0; j < this.width; j++) {
        this.grid[i].push(new Cell(this.ctx, i, j));
      }
    }
  }
  checkNeighbors(i, j) {
    let n = 0;
    for (let row = i - 1; row < i + 2; row++) {
      for (let col = j - 1; col < j + 2; col++) {
        if ((col != j || row != i) && this.isAlive(row, col)) {
          n++;
        }
      }
    }
    return n;
  }

  isAlive(i, j) {
    if (j < 0 || j >= this.width || i < 0 || i >= this.height) {
      return false;
    }
    return this.grid[i][j].alive;
  }

  nextGen() {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        let cell = this.grid[i][j];
        let numAlive = this.checkNeighbors(i, j);
        if (cell.alive) {
          if (numAlive == 2 || numAlive == 3) {
            cell.nextAlive = true;
            cell.age += 1;
          } else {
            cell.nextAlive = false;
            cell.age = 0;
          }
        } else {
          if (numAlive == 3) {
            cell.nextAlive = true;
            cell.age = 0;
          } else {
            cell.nextAlive = false;
            cell.age = 0;
          }
        }
      }
    }
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        let cell = this.grid[i][j];
        cell.alive = cell.nextAlive;
      }
    }
  }
  draw() {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        this.grid[i][j].draw();
      }
    }
  }
}
