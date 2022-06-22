class Cell {
  static width = 10;
  static height = 10;
  constructor(context, gridX, gridY) {
    this.context = context;
    this.gridX = gridX;
    this.gridY = gridY;
    this.alive = Math.random() > 0.5;
  }
  draw(beautify) {
    if (!beautify) {
      this.context.fillStyle = this.alive ? "#0099b0" : "#404040";
    } else {
      if (this.alive) {
        this.deadCount = 0;
      } else {
        this.deadCount++;
      }
      if (this.alive) {
        this.context.fillStyle = "#05ceec";
      } else if (this.deadCount == 1) {
        this.context.fillStyle = "#0099b0";
      } else if (this.deadCount == 2) {
        this.context.fillStyle = "#007a8c";
      } else {
        this.context.fillStyle = "#404040";
      }
    }
    this.context.beginPath();
    this.context.arc(
      this.gridX * Cell.width,
      this.gridY * Cell.height,
      Cell.width / 2,
      0,
      2 * Math.PI
    );
    this.context.fill();
  }
}
class GameWorld {
  static numColumns = 75;
  static numRows = 40;
  constructor(canvasId, applyAliveDirectly, beautify) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext("2d");
    this.gameObjects = [];
    this.beautify = beautify;
    this.applyAliveDirectly = applyAliveDirectly;
    this.createGrid();
    window.requestAnimationFrame(() => this.gameLoop());
  }
  createGrid() {
    for (let y = 0; y < GameWorld.numRows; y++) {
      for (let x = 0; x < GameWorld.numColumns; x++) {
        this.gameObjects.push(new Cell(this.context, x, y));
      }
    }
  }
  isAlive(x, y) {
    if (x < 0 || x >= GameWorld.numColumns || y < 0 || y >= GameWorld.numRows) {
      return false;
    }
    return this.gameObjects[this.gridToIndex(x, y)].alive ? 1 : 0;
  }
  gridToIndex(x, y) {
    return x + y * GameWorld.numColumns;
  }
  checkSurrounding() {
    for (let x = 0; x < GameWorld.numColumns; x++) {
      for (let y = 0; y < GameWorld.numRows; y++) {
        let numAlive =
          this.isAlive(x - 1, y - 1) +
          this.isAlive(x, y - 1) +
          this.isAlive(x + 1, y - 1) +
          this.isAlive(x - 1, y) +
          this.isAlive(x + 1, y) +
          this.isAlive(x - 1, y + 1) +
          this.isAlive(x, y + 1) +
          this.isAlive(x + 1, y + 1);
        let centerIndex = this.gridToIndex(x, y);
        if (numAlive == 2) {
          this.gameObjects[centerIndex].nextAlive =
            this.gameObjects[centerIndex].alive;
        } else if (numAlive == 3) {
          this.gameObjects[centerIndex].nextAlive = true;
        } else {
          this.gameObjects[centerIndex].nextAlive = false;
        }
        if (this.applyAliveDirectly) {
          this.gameObjects[centerIndex].alive =
            this.gameObjects[centerIndex].nextAlive;
        }
      }
    }
    for (let i = 0; i < this.gameObjects.length; i++) {
      this.gameObjects[i].alive = this.gameObjects[i].nextAlive;
    }
  }
  gameLoop() {
    if (this.canvas.inViewport) {
      this.checkSurrounding();
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.fillStyle = "#404040";
      this.context.fillRect(
        0,
        0,
        GameWorld.numColumns * Cell.width,
        GameWorld.numRows * Cell.height
      );
      for (let i = 0; i < this.gameObjects.length; i++) {
        this.gameObjects[i].draw(this.beautify);
      }
    }
    setTimeout(() => {
      window.requestAnimationFrame(() => this.gameLoop());
    }, 100);
  }
  reset() {
    this.gameObjects = [];
    this.createGrid();
  }
}
let gameWorld;
let gameWorld2;
document.addEventListener("firstCanvasVisible", function (event) {
  gameWorld = new GameWorld("canvas", false, false);
  gameWorld2 = new GameWorld("canvas2", true, false);
});
function handleClickReset(event) {
  gameWorld.reset();
  gameWorld2.reset();
}
