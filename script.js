function gameBoard() {

  const gridSize = 3;
  const grid = [];

  for (let i = 0; i < gridSize; i++) {
    grid[i] = [];
    for (let j = 0; j < gridSize; j++) {
      grid[i].push("[]")
    }
  }

  function printBoard() {
    console.log(grid[0])
    console.log(grid[1])
    console.log(grid[2])
  }

  function placeMarker(marker, x, y) {
    grid[x][y] = marker;
  }

  return { printBoard, placeMarker };
};

const gameLogic = (function () {

  const board = gameBoard();
  const roundCounter = function () {
    let currentRound = 0;
    const nextRound = () => currentRound++;
    const getCurrentRound = () => currentRound;
    return { getCurrentRound, nextRound };
  }();


  const players = (function () {
    const playerOne = createPlayer("playerOne", "X");
    const playerTwo = createPlayer("playerTwo", "O");

    function createPlayer(name, marker) {
      let score = 0;
      const getScore = () => score;
      const addScore = () => score++;
      return { name, marker, getScore, addScore };
    }
    return { playerOne, playerTwo };

  })();


  return { players, board, roundCounter }
})();