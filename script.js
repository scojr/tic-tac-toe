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
      currentCell.writeValue();
      if (checkBoardStatus()) console.log("true"); else console.log("false");
      gameElements.nextRound();
    }
  }

  function checkBoardStatus() {
    for (const row of gridRows) {
      const rowValues = row.map((x) => x.getValue());
      if (threeValuesEqual(rowValues[0], rowValues[1], rowValues[2])) return true;
      if (checkColumn(gridRows.indexOf(row))) return true;
    }
    function checkColumn(column) {
      const columnValues = [];
      for (const row of gridRows) {
        columnValues.push(row[column].getValue())
      }
      if (threeValuesEqual(columnValues[0], columnValues[1], columnValues[2])) return true;
    }
    const gridCornerValues = [gridRows[0][0].getValue(), gridRows[0][2].getValue(), gridRows[2][0].getValue(), gridRows[2][2].getValue()];
    const gridCenterValue = gridRows[1][1].getValue();

    if (threeValuesEqual(gridCornerValues[0], gridCenterValue, gridCornerValues[3])) return true;
    if (threeValuesEqual(gridCornerValues[2], gridCenterValue, gridCornerValues[1])) return true;

  }

  function threeValuesEqual(value1, value2, value3) {
    if (value1 === value2 && value2 === value3 && value1) return true; else return false;
  }

  return { printBoard, placeMarker };
};

function createCell(x, y) {
  let value = 0;
  const getValue = () => value;
  const writeValue = () => value = gameElements.getCurrentPlayer().marker;
  return { x, y, getValue, writeValue };
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
    gameElements.board.printBoard();
  }

  return { playRound }
})();

gameLogic.playRound();