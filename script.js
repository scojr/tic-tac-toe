const gameBoard = (function () {

  const grid = [];

  function makeColumn() {
    let column1 = "";
    let column2 = "";
    let column3 = "";
    return [column1, column2, column3];
  }

  for (let i = 2; i >= 0; i--) {
    grid.push(makeColumn());
  }

  function drawBoard() {
    console.log(this.grid[0])
    console.log(this.grid[1])
    console.log(this.grid[2])
  }

  function placeMarker(marker, x, y) {
    this.grid[x][y] = marker;
  }

  return { grid, drawBoard, placeMarker };
})();
