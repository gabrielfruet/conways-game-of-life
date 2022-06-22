const seed = 0.5;

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
    this.context.fillStyle = this.alive ? "#ff8080" : "#303030";
    if (this.alive) {
      this.context.beginPath();
      this.context.arc(
        this.i * Cell.width,
        this.j * Cell.height,
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
            this.age += 1;
          } else {
            cell.nextAlive = false;
            this.age = 0;
          }
        } else {
          if (numAlive == 3) {
            cell.nextAlive = true;
          } else {
            cell.nextAlive = false;
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
