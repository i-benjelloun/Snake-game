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
