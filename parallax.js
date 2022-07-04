let stars = document.querySelector("#stars");
let moon = document.querySelector("#moon");
let mountains_behind = document.querySelector("#mountains_behind");
let text = document.querySelector("#text");
let terra = document.querySelector("#terra");
let header = document.querySelector("header");


window.addEventListener("scroll", () => {
  let value = window.scrollY;
  stars.style.left = value * 0.25 + "px";
  moon.style.top = value * 1.05 + "px";
  mountains_behind.style.top = value * 0.5 + "px";
  terra.style.top = value * 0.1 + "px";
  text.style.marginBottom = value * 0.5 + "px";
  header.style.top = value * 0.5 + "px";

});
