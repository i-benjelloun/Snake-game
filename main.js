window.addEventListener("load", () => {
  grid.set();
});

let cells = [];
let start = 0;
let speedCounter = 0;

const cursorLeft = document.querySelector("#cursor-left");
const cursorRight = document.querySelector("#cursor-right");
const cursorUp = document.querySelector("#cursor-up");
const cursorDown = document.querySelector("#cursor-down");

const backgroundMusic = document.querySelector("#background-music");
const soundOnBtn = document.querySelector("#sound-on");
const soundOffBtn = document.querySelector("#sound-off");

const frameBtn = document.querySelector("#frame-btn");
const noFrameBtn = document.querySelector("#no-frame-btn");

const generalPopUp = document.querySelector(".pop-up#general-pop-up");
const optionsPopUp = document.querySelector(".pop-up#options-pop-up");
const playBtn = document.querySelector("#play-btn");

const optionsBtn = document.querySelector("#options-btn");
const leftArrow = document.querySelector("#left-arrow");

let grid = {
  height: 25,
  width: 25,
  size: 25 * 25,
  gridElement: document.querySelector(".grid"),

  set: function () {
    for (let i = 0; i < this.width * this.height; i++) {
      let cell = document.createElement("div");
      this.gridElement.appendChild(cell);
      cell.classList.add("cell");
      cells.push(cell);
    }
  },

  reset: function () {
    cells.forEach((cell) => {
      cell.classList.remove("snake");
      cell.classList.remove("food");
    });
  },
};

// Move snake with keyboard keys
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowRight":
      snake.nextDirection = "right";
      break;

    case "ArrowUp":
      snake.nextDirection = "up";
      break;

    case "ArrowLeft":
      snake.nextDirection = "left";
      break;

    case "ArrowDown":
      snake.nextDirection = "down";
      break;
  }
  event.preventDefault();
});

// Move snake with screen touch for mobile
cursorLeft.addEventListener("touchstart", () => {
  snake.nextDirection = "left";
  navigator.vibrate(50);
});
cursorRight.addEventListener("touchstart", () => {
  snake.nextDirection = "right";
  navigator.vibrate(50);
});
cursorUp.addEventListener("touchstart", () => {
  snake.nextDirection = "up";
  navigator.vibrate(50);
});
cursorDown.addEventListener("touchstart", () => {
  snake.nextDirection = "down";
  navigator.vibrate(50);
});

// play game
playBtn.addEventListener("click", () => {
  document.querySelector("#mask").classList.add("hidden");
  generalPopUp.classList.add("hidden");
  grid.gridElement.classList.remove("blurred");
  backgroundMusic.play();
  game.reset();
  game.start();
});

//Display options window
optionsBtn.addEventListener("click", () => {
  optionsPopUp.classList.remove("hidden");
});

//Exit options window
leftArrow.addEventListener("click", () => {
  optionsPopUp.classList.add("hidden");
});

//Frame/noFrame button management
frameBtn.addEventListener("click", () => {
  grid.gridElement.classList.add("frame");
  frameBtn.classList.toggle("frame-btn-selected");
  noFrameBtn.classList.toggle("frame-btn-selected");
  game.frame = true;
});
noFrameBtn.addEventListener("click", () => {
  grid.gridElement.classList.remove("frame");
  noFrameBtn.classList.toggle("frame-btn-selected");
  frameBtn.classList.toggle("frame-btn-selected");
  game.frame = false;
});

// Mute/unMute button management
soundOnBtn.addEventListener("click", () => {
  backgroundMusic.muted = true;
  soundOnBtn.classList.add("hidden");
  soundOffBtn.classList.remove("hidden");
});

soundOffBtn.addEventListener("click", () => {
  backgroundMusic.muted = false;
  soundOnBtn.classList.remove("hidden");
  soundOffBtn.classList.add("hidden");
});
