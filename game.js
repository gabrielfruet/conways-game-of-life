"use strict";


let canvasTag = document.querySelector("canvas");
window.onload = canvasTag.setAttribute("width", window.innerWidth)
window.addEventListener("resize",() =>{
  canvasTag.setAttribute("width", window.innerWidth)
})



const delay = 50;

let canvas;
let context;
let game;

class Cell {
  static width = 5;
  static height = 5;

  constructor(context, i, j) {
    this.context = context;

    this.i = i;
    this.j = j;

    this.alive = Math.random() > 0.7;
    this.age = 0;
    this.nextAlive;
  }

  draw() {
    this.context.fillStyle = this.alive ? "#8080ff" : "#303030";
    if (this.alive) {
      this.context.beginPath();
      this.context.arc(
        (this.j ) * Cell.width,
        (this.i) * Cell.height,
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
    this.throughAll((cell, i, j) => {
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
    });
    //for (let i = 0; i < this.height; i++) {
    //for (let j = 0; j < this.width; j++) {
    //let cell = this.grid[i][j];
    //let numAlive = this.checkNeighbors(i, j);
    //if (cell.alive) {
    //if (numAlive == 2 || numAlive == 3) {
    //cell.nextAlive = true;
    //this.age += 1;
    //} else {
    //cell.nextAlive = false;
    //this.age = 0;
    //}
    //} else {
    //if (numAlive == 3) {
    //cell.nextAlive = true;
    //} else {
    //cell.nextAlive = false;
    //}
    //}
    //}
    //}
    this.throughAll((cell) => {
      cell.alive = cell.nextAlive;
    });
  }
  draw() {
    this.throughAll((cell) => {
      cell.draw();
    });
  }
  throughAll(callback) {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        callback(this.grid[i][j], i, j);
      }
    }
  }
}

window.onload = init;

function init() {
  canvas = document.getElementById("table");
  context = canvas.getContext("2d");

  game = new GameOfLife();
  game.draw();
  window.requestAnimationFrame(() => gameLoop());

  function gameLoop() {
    context.fillStyle = "303030";
    context.fillRect(0, 0, canvas.width, canvas.height);
    game.draw();
    game.nextGen();

    setTimeout(() => {
      window.requestAnimationFrame(() => gameLoop());
    }, delay);
  }
}
