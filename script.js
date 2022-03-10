window.addEventListener("load", () => {
  grid.set();
});

let cells = [];
let snakeElements = [];
const gridWidth = 25;
const gridHeight = 25;
let start = 0;
let speedCounter = 0;

let game = {
  score: 0,
  bestScore: 0,
  speed: 200,
  frame: false,

  reset: function () {
    snakeElements = [];
    snake.reset();
    this.resetScore();
    grid.reset();
    snake.createNew();
    snake.show();
    food.generateNew();
    food.show();
  },

  //main function where everything happens :)
  start: function () {
    function main(timestamp) {
      let gameOver;
      if (!start || timestamp - start >= game.speed) {
        start = timestamp;
        game.setInitialSpeed();
        snake.changeDirection();
        snake.move();
        snake.show();
        gameOver = game.checkGameOver();
        snake.checkFood();
        food.show();
        game.writeScore();
        game.writeBestScore();
      }
      if (!gameOver) window.requestAnimationFrame(main);
    }
    this.animationFrame = window.requestAnimationFrame(main);
  },

  // Setting initial excecution rate of the game, the higher the rate, the lower the speed
  setInitialSpeed: function () {
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

  // Check if snake collided with frame, or with itself
  checkGameOver: function () {
    let gameOver = false;
    if (snake.checkBite() || snake.checkCollision()) {
      gameOver = true;
      document.querySelector("#background-music").pause();
      document.querySelector("#background-music").currentTime = 0;
      window.cancelAnimationFrame(this.animationFrame);
      document.querySelector(".pop-up h1").textContent = "Game Over !!!";
      document.querySelector("#mask").classList.remove("hidden");
      document.querySelector(".pop-up").classList.remove("hidden");
      document.querySelector(".grid").classList.add("blurred");
    }
    return gameOver;
  },

  // Write current score on the interface
  writeScore: function () {
    let scoreElement = document.querySelector("#score");
    scoreElement.textContent = `Score: ${this.score}`;
  },

  resetScore: function () {
    this.score = 0;
  },

  // Write best score on the interface
  writeBestScore: function () {
    let bestScoreElement = document.querySelector("#best-score");
    bestScoreElement.textContent = `Best score: ${this.bestScore}`;
  },
};

let grid = {
  height: gridHeight,
  width: gridWidth,
  size: gridHeight * gridWidth,
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
  headPosition: 0,
  direction: "",
  nextDirection: "",

  createNew: function () {
    const initialPosition = Math.floor(
      Math.random() * (grid.width * grid.height)
    );
    snakeElements.push(cells[initialPosition]);
    this.headPosition = cells.indexOf(snakeElements[snakeElements.length - 1]);
  },

  // Display the snake on the screen
  show: function () {
    cells.forEach((element) => element.classList.remove("snake"));
    snakeElements.forEach((element) => element.classList.add("snake"));
  },

  // Add a snake element to the beginning of the snake
  grow: function () {
    snakeElements.unshift(cells[cells.indexOf(snakeElements[0] - 1)]);
  },

  updateSnakeElements: function () {
    snakeElements.shift();
    snakeElements.push(cells[this.headPosition]);
  },

  inTopRow: function () {
    return Math.floor(this.headPosition / grid.width) === 0;
  },

  inBottomRow: function () {
    return Math.floor(this.headPosition / grid.width) === grid.width - 1;
  },

  inRightColumn: function () {
    return this.headPosition % grid.width === grid.width - 1;
  },

  inLeftColumn: function () {
    return this.headPosition % grid.width === 0;
  },

  // Change current direction
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

  updateHeadPosition: function (border, increment, noFrameIncrement) {
    if (!border) {
      this.headPosition += increment;
      this.updateSnakeElements();
    } else {
      if (game.frame) {
        this.collision = true;
      } else {
        this.headPosition += noFrameIncrement;
        this.updateSnakeElements();
      }
    }
  },

  moveRight: function () {
    const increment = 1;
    const noFrameIncrement = 1 - grid.width;
    this.updateHeadPosition(this.inRightColumn(), increment, noFrameIncrement);
  },

  moveLeft: function () {
    const increment = -1;
    const noFrameIncrement = grid.width - 1;
    this.updateHeadPosition(this.inLeftColumn(), increment, noFrameIncrement);
  },

  moveUp: function () {
    const increment = -grid.width;
    const noFrameIncrement = grid.width * (grid.height - 1);
    this.updateHeadPosition(this.inTopRow(), increment, noFrameIncrement);
  },

  moveDown: function () {
    const increment = grid.width;
    const noFrameIncrement = -grid.width * (grid.height - 1);
    this.updateHeadPosition(this.inBottomRow(), increment, noFrameIncrement);
  },

  // Updating the head postion of the snake
  move: function () {
    switch (this.direction) {
      case "right":
        this.moveRight();
        break;

      case "up":
        this.moveUp();
        break;

      case "left":
        this.moveLeft();
        break;

      case "down":
        this.moveDown();
        break;
    }
  },

  checkFood: function () {
    let eat = this.headPosition === food.position;
    if (eat) {
      this.grow();
      food.generateNew();
      game.score += 1;
      speedCounter += 1;
      if (game.score > game.bestScore) game.bestScore += 1;
      if (game.score % 5 === 0) {
        speedCounter = 0;
        game.speed -= 0.2 * game.speed;
        if (game.speed <= 5) game.speed = 5;
      }
    }
    return eat;
  },

  // Check if snake collided with itself
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

  generateNew: function () {
    this.remove();
    let freeCells = cells.filter((cell) => !cell.classList.contains("snake"));
    let freePositions = freeCells.map((e) => cells.indexOf(e));
    this.position =
      freePositions[Math.floor(Math.random() * freePositions.length)];
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

// play game
document.querySelector("#play-btn").addEventListener("click", () => {
  document.querySelector("#mask").classList.add("hidden");
  document.querySelector(".pop-up#general-pop-up").classList.add("hidden");
  document.querySelector(".grid").classList.remove("blurred");
  document.querySelector("#background-music").play();
  game.reset();
  game.start();
});

//Display options window
document.querySelector("#options-btn").addEventListener("click", () => {
  document.querySelector(".pop-up#options-pop-up").classList.remove("hidden");
});

//Exit options window
document.querySelector("#left-arrow").addEventListener("click", () => {
  document.querySelector(".pop-up#options-pop-up").classList.add("hidden");
});

//Frame/noFrame button management
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

// Mute/unMute button management
document.querySelector("#sound-on").addEventListener("click", () => {
  document.querySelectorAll("audio").forEach((track) => {
    track.muted = true;
    document.querySelector("#sound-on").classList.add("hidden");
    document.querySelector("#sound-off").classList.remove("hidden");
  });
});
document.querySelector("#sound-off").addEventListener("click", () => {
  document.querySelectorAll("audio").forEach((track) => {
    track.muted = false;
    document.querySelector("#sound-on").classList.remove("hidden");
    document.querySelector("#sound-off").classList.add("hidden");
  });
});

// Best Score --> DONE
// new game after game over --> DONE
// Food generated on snake --> DONE
// increased speed over score --> DONE
// Change direction bug --> DONE
// Responsivity --> DONE
// Design --> DONE
// Music / sound effects -- DONE
