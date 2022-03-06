window.addEventListener("load", () => {
  startGame();
});

let cells = [];
let snakeElements = [];
let foodElements = [];
const gridWidth = 25;
const gridHeight = 25;

let game = {
  score: 0,
  bestScore: 0,
  checkGameOver: function () {
    if (snake.checkBite() || snake.checkCollision()) {
      clearInterval(interval);
      alert("Game Over");
    }
  },
  updateScore: function () {
    let scoreElement = document.querySelector("#score");
    console.log(this.score);
    scoreElement.textContent = `Score: ${this.score}`;
  },
};

let grid = {
  height: gridHeight,
  width: gridWidth,
  set: function () {
    const gridElement = document.querySelector(".grid");
    for (let i = 0; i < this.width * this.height; i++) {
      let cell = document.createElement("div");
      gridElement.appendChild(cell);
      cell.classList.add("cell");
      cells.push(cell);
    }
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
      // console.log(game.score);
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
};

let food = {
  position: Math.floor(Math.random() * (grid.width * grid.height)),

  show: function () {
    cells[this.position].classList.add("food");
  },

  remove: function () {
    cells[this.position].classList.remove("food");
  },

  updatePosition: function () {
    this.remove();
    this.position = Math.floor(Math.random() * (grid.width * grid.height));
    this.show();
  },
};

function startGame() {
  grid.set();
  snake.create();
  food.show();
}

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

let interval = setInterval(() => {
  snake.move();
  game.checkGameOver();
  snake.checkFood();
  game.updateScore();
}, 200);
