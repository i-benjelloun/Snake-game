let snakeElements = [];

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

  // take the last element of the snake an place it in the first position to five the impression of a moving snake
  updateSnakeElements: function () {
    snakeElements.shift();
    snakeElements.push(cells[this.headPosition]);
  },

  //check if head of snake is in the top row of the grid
  inTopRow: function () {
    return Math.floor(this.headPosition / grid.width) === 0;
  },

  //check if head of snake is in the bottom row of the grid
  inBottomRow: function () {
    return Math.floor(this.headPosition / grid.width) === grid.width - 1;
  },

  //check if head of snake is in the right column of the grid
  inRightColumn: function () {
    return this.headPosition % grid.width === grid.width - 1;
  },

  //check if head of snake is in the left column of the grid
  inLeftColumn: function () {
    return this.headPosition % grid.width === 0;
  },

  // Change current direction only if the next direction is not opposit of current direction
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

  // Updating the head postion of the snake based on direction
  move: function () {
    switch (this.direction) {
      case "right":
        this.updateHeadPosition(this.inRightColumn(), 1, 1 - grid.width);
        break;

      case "up":
        this.updateHeadPosition(
          this.inTopRow(),
          -grid.width,
          grid.width * (grid.height - 1)
        );
        break;

      case "left":
        this.updateHeadPosition(this.inLeftColumn(), -1, grid.width - 1);
        break;

      case "down":
        this.updateHeadPosition(
          this.inBottomRow(),
          grid.width,
          -grid.width * (grid.height - 1)
        );
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

  //Check if snake collided with the borders
  checkCollision: function () {
    return this.collision;
  },

  // Reset the snake
  reset: function () {
    this.direction = "";
    this.nextDirection = "";
    this.collision = false;
  },
};
