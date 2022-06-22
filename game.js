"use strict";

const delay = 100;

let canvas;
let context;
let game;

window.onload = init;

function init() {
  canvas = document.getElementById("table");
  context = canvas.getContext("2d");

  game = new GameOfLife();
  game.draw();
  window.requestAnimationFrame(() => gameLoop());
  canvas.style.width = "100vw";
  canvas.style.heigth = "100vh";
  function gameLoop() {
    context.fillStyle = "303030";
    context.fillRect(0, 0, canvas.width, canvas.height);
    game.nextGen();
    game.draw();

    setTimeout(() => {
      window.requestAnimationFrame(() => gameLoop());
    }, delay);
  }
}
