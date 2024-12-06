function gameBoard() {
  const gridSize = 3;
  const gridRows = [];

  for (let i = 0; i < gridSize; i++) {
    gridRows[i] = [];
    for (let j = 0; j < gridSize; j++) {
      gridRows[i].push(createCell(i, j))
    }
  }

  function printBoard() {
    for (const row of gridRows) {
      const rowValues = row.map((x) => x.getValue());
      console.log(rowValues);
    }
  }

  function placeMarker(x, y) {
    const cellRow = gridRows[x];
    const currentCell = cellRow[y];
    if (!currentCell.getValue()) {
      currentCell.writeMarker();
      gameElements.nextRound();
    }
  }

  return { printBoard, placeMarker };
};

function createCell(x, y) {
  let value = 0;
  const getValue = () => value;
  const writeMarker = () => value = gameElements.getCurrentPlayer().marker;
  return { x, y, getValue, writeMarker };
}

const gameElements = (function () {
  const board = gameBoard();

  const players = (function () {
    const playerOne = createPlayer("Player 1", "X");
    const playerTwo = createPlayer("Player 2", "O");

    function createPlayer(name, marker) {
      let score = 0;
      const getScore = () => score;
      const addScore = () => score++;
      return { name, marker, getScore, addScore };
    }
    return { playerOne, playerTwo };
  })();

  let currentPlayer = players.playerOne;

  const getCurrentPlayer = () => currentPlayer;

  let currentRound = 1;
  function nextRound() { currentRound++; switchCurrentPlayer(); gameLogic.playRound() };
  function getCurrentRound() { return currentRound };

  function switchCurrentPlayer() {
    if (currentPlayer === players.playerOne) {
      currentPlayer = players.playerTwo;
    } else {
      currentPlayer = players.playerOne;
    }
  }

  return { board, nextRound, getCurrentRound, getCurrentPlayer }
})();

const gameLogic = (function () {
  function playRound() {
    console.log(`Round ${gameElements.getCurrentRound()}. It is ${gameElements.getCurrentPlayer().name}'s turn.`)
  }

  return { playRound }
})();

gameLogic.playRound();