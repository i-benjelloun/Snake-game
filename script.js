window.addEventListener("load", () => {
  grid.set();
  snake.create();
  food.updatePosition();
  game.start();
});

let cells = [];
let snakeElements = [];
const gridWidth = 25;
const gridHeight = 25;

let game = {
  score: 0,
  bestScore: 0,
  speed: 200,

  reset: function () {
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
    this.interval = setInterval(() => {
      document.querySelector("#play-again").classList.add("hidden");
      snake.move();
      this.checkGameOver();
      snake.checkFood();
      this.updateScore();
      this.updateBestScore();
    }, this.speed);
  },

  checkGameOver: function () {
    if (snake.checkBite() || snake.checkCollision()) {
      clearInterval(this.interval);
      document.querySelector("#play-again").classList.remove("hidden");
      alert("Game Over");
    }
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

  move: function () {
    switch (this.direction) {
      case "right":
        if (this.headPosition % grid.width !== grid.width - 1) {
          this.headPosition += 1;
          this.update();
        } else {
          this.collision = true;
        }
        break;

      case "up":
        if (this.headPosition % grid.width !== this.headPosition) {
          this.headPosition -= gridWidth;
          this.update();
        } else this.collision = true;
        break;

      case "left":
        if (this.headPosition % grid.width !== 0) {
          this.headPosition -= 1;
          this.update();
        } else this.collision = true;
        break;

      case "down":
        if (this.headPosition < grid.height * grid.width - grid.width) {
          this.headPosition += gridWidth;
          this.update();
        } else this.collision = true;
        break;
    }
  },

  checkFood: function () {
    let eat = this.headPosition === food.position;
    if (eat) {
      this.grow();
      food.updatePosition();
      game.score += 1;
      if (game.score > game.bestScore) game.bestScore += 1;
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
      if (snake.direction !== "left") snake.direction = "right";
      break;
    case "ArrowUp":
      if (snake.direction !== "down") snake.direction = "up";
      break;
    case "ArrowLeft":
      if (snake.direction !== "right") snake.direction = "left";
      break;
    case "ArrowDown":
      if (snake.direction !== "up") snake.direction = "down";
      break;
    case "s":
      clearInterval(interval);
      break;
  }
  event.preventDefault();
});

document
  .querySelector("#play-again")
  .addEventListener("click", game.reset.bind(game));

// Best Score --> DONE
// new game after game over --> DONE
// Food generated on snake --> DONE
// increased speed over time (or score ?)
// Responsivity
// Design
