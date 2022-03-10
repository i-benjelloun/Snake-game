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
