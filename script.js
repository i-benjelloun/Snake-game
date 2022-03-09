window.addEventListener("load", () => {
  grid.set();
});

let cells = [];
let snakeElements = [];
const gridWidth = 25;
const gridHeight = 25;
let start = 0;
let speedCounter = 0;

function main(timestamp) {
  let gameOver;
  if (!start || timestamp - start >= game.speed) {
    start = timestamp;
    snake.changeDirection();
    snake.move();
    gameOver = game.checkGameOver();
    snake.checkFood();
    game.updateScore();
    game.updateBestScore();
  }
  if (!gameOver) window.requestAnimationFrame(main);
}

let game = {
  score: 0,
  bestScore: 0,
  speed: 200,
  frame: false,

  reset: function () {
    game.setSpeed();
    this.score = 0;
    snakeElements = [];
    snake.reset();
    this.updateScore();
    grid.reset();
    snake.create();
    food.updatePosition();
    this.start();
  },

  start: function () {
    this.animationFrame = window.requestAnimationFrame(main);
  },

  setSpeed: function () {
    let speedLevel = document.querySelector(
      'input[name="speed-level"]:checked'
    ).value;
    switch (speedLevel) {
      case "1":
        this.speed = 400;
        break;
      case "2":
        this.speed = 200;
        break;
      case "3":
        this.speed = 100;
        break;
      default:
        break;
    }
  },

  checkGameOver: function () {
    let gameOver = false;
    if (snake.checkBite() || snake.checkCollision()) {
      gameOver = true;
      window.cancelAnimationFrame(this.animationFrame);
      document.querySelector(".pop-up h1").textContent = "Game Over !!!";
      document.querySelector("#mask").classList.remove("hidden");
      document.querySelector(".pop-up").classList.remove("hidden");
      document.querySelector(".grid").classList.add("blurred");
    }
    return gameOver;
  },

  updateScore: function () {
    let scoreElement = document.querySelector("#score");
    scoreElement.textContent = `Score: ${this.score}`;
  },

  updateBestScore: function () {
    let bestScoreElement = document.querySelector("#best-score");
    bestScoreElement.textContent = `Best score: ${this.bestScore}`;
  },
};

let grid = {
  height: gridHeight,
  width: gridWidth,
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

let snake = {
  initialPosition: Math.floor(Math.random() * (grid.width * grid.height)),
  tailPosition: 0,
  headPosition: 0,
  direction: "",
  nextDirection: "",

  create: function () {
    snakeElements.push(cells[this.initialPosition]);
    this.tailPosition = cells.indexOf(snakeElements[0]);
    this.headPosition = cells.indexOf(snakeElements[snakeElements.length - 1]);
    snake.show();
  },

  show: function () {
    cells.forEach((element) => element.classList.remove("snake"));
    snakeElements.forEach((element) => element.classList.add("snake"));
  },

  grow: function () {
    snakeElements.unshift(cells[this.tailPosition - 1]);
  },

  update: function () {
    snakeElements.shift();
    snakeElements.push(cells[this.headPosition]);
    this.show();
  },

  changeDirection: function () {
    if (this.direction !== "left" && this.nextDirection === "right") {
      this.direction = this.nextDirection;
    }
    if (this.direction !== "right" && this.nextDirection === "left") {
      this.direction = this.nextDirection;
    }
    if (this.direction !== "up" && this.nextDirection === "down") {
      this.direction = this.nextDirection;
    }
    if (this.direction !== "down" && this.nextDirection === "up") {
      this.direction = this.nextDirection;
    }
  },

  move: function () {
    switch (this.direction) {
      case "right":
        if (this.headPosition % grid.width !== grid.width - 1) {
          this.headPosition += 1;
          this.update();
        } else {
          if (game.frame) {
            this.collision = true;
          } else {
            this.headPosition -= grid.width - 1;
            this.update();
          }
        }
        break;

      case "up":
        if (this.headPosition % grid.width !== this.headPosition) {
          this.headPosition -= grid.width;
          this.update();
        } else {
          if (game.frame) {
            this.collision = true;
          } else {
            this.headPosition += grid.width * (grid.height - 1);
            this.update();
          }
        }
        break;

      case "left":
        if (this.headPosition % grid.width !== 0) {
          this.headPosition -= 1;
          this.update();
        } else {
          if (game.frame) {
            this.collision = true;
          } else {
            this.headPosition += grid.width - 1;
            this.update();
          }
        }
        break;

      case "down":
        if (this.headPosition < grid.height * grid.width - grid.width) {
          this.headPosition += gridWidth;
          this.update();
        } else {
          if (game.frame) {
            this.collision = true;
          } else {
            this.headPosition -= grid.width * (grid.height - 1);
            this.update();
          }
        }
        break;
    }
  },

  checkFood: function () {
    let eat = this.headPosition === food.position;
    if (eat) {
      this.grow();
      food.updatePosition();
      game.score += 1;
      speedCounter += 1;
      if (game.score > game.bestScore) game.bestScore += 1;
      if (game.score % 5 === 0) {
        game.speed -= 0.2 * game.speed;
        speedCounter = 0;
        if (game.speed <= 5) game.speed = 5;
      }
    }

    return eat;
  },

  checkBite: function () {
    let positions = snakeElements.map((e) => cells.indexOf(e));
    let bite = new Set(positions).size !== positions.length;
    return bite;
  },

  checkCollision: function () {
    return this.collision;
  },

  reset: function () {
    this.direction = "";
    this.nextDirection = "";
    this.collision = false;
  },
};

let food = {
  position: 0,

  show: function () {
    cells[this.position].classList.add("food");
  },

  remove: function () {
    cells[this.position].classList.remove("food");
  },

  updatePosition: function () {
    this.remove();
    let freeCells = cells.filter((cell) => !cell.classList.contains("snake"));
    let freePositions = freeCells.map((e) => cells.indexOf(e));
    this.position =
      freePositions[Math.floor(Math.random() * freePositions.length)];
    this.show();
  },
};

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

document.querySelector("#play-btn").addEventListener("click", () => {
  game.reset();
  document.querySelector("#mask").classList.add("hidden");
  document.querySelector(".pop-up#general-pop-up").classList.add("hidden");
  document.querySelector(".grid").classList.remove("blurred");
});

document.querySelector("#options-btn").addEventListener("click", () => {
  document.querySelector(".pop-up#options-pop-up").classList.remove("hidden");
});

document.querySelector("#left-arrow").addEventListener("click", () => {
  document.querySelector(".pop-up#options-pop-up").classList.add("hidden");
});

document.querySelector("#frame-btn").addEventListener("click", () => {
  grid.gridElement.classList.add("frame");
  document.querySelector("#frame-btn").classList.toggle("frame-btn-selected");
  document
    .querySelector("#no-frame-btn")
    .classList.toggle("frame-btn-selected");
  game.frame = true;
});

document.querySelector("#no-frame-btn").addEventListener("click", () => {
  grid.gridElement.classList.remove("frame");
  document
    .querySelector("#no-frame-btn")
    .classList.toggle("frame-btn-selected");
  document.querySelector("#frame-btn").classList.toggle("frame-btn-selected");
  game.frame = false;
});

document.querySelector("#arrow-left").addEventListener("touchstart", () => {
  snake.nextDirection = "left";
  navigator.vibrate(50);
});
document.querySelector("#arrow-right").addEventListener("touchstart", () => {
  snake.nextDirection = "right";
  navigator.vibrate(50);
});
document.querySelector("#arrow-up").addEventListener("touchstart", () => {
  snake.nextDirection = "up";
  navigator.vibrate(50);
});
document.querySelector("#arrow-down").addEventListener("touchstart", () => {
  snake.nextDirection = "down";
  navigator.vibrate(50);
});

// Best Score --> DONE
// new game after game over --> DONE
// Food generated on snake --> DONE
// increased speed over score --> DONE
// Change direction bug --> DONE
// Responsivity
// Design
