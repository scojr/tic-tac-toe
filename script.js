function gameBoard() {
  const gridSize = 3;
  let gridRows = [];

  for (let i = 0; i < gridSize; i++) {
    gridRows[i] = [];
    for (let j = 0; j < gridSize; j++) {
      gridRows[i].push(createCell(i, j))
    }
  }

  function createCell(x, y) {
    let value = 0;
    const getValue = () => value;
    const writeValue = () => value = gameElements.getCurrentPlayer().marker;
    const resetValue = () => value = 0;
    return { x, y, getValue, writeValue, resetValue };
  }

  function printBoard() {
    displayController.drawGrid(gridRows);
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
      if (checkBoardStatus()) gameLogic.winDetected(gameElements.getCurrentPlayer()); else gameElements.nextRound();
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

    if (gameElements.getCurrentRound() === 9) gameLogic.tieDetected();

  }

  function resetBoard() {
    for (const row of gridRows) {
      const rowValues = row;
      for (const values of rowValues) {
        values.resetValue();
      }
    }
  }

  function threeValuesEqual(value1, value2, value3) {
    if (value1 === value2 && value2 === value3 && value1) return true; else return false;
  }

  return { printBoard, placeMarker, resetBoard };
};

const gameElements = (function () {
  const board = gameBoard();

  const players = (function () {
    const playerOne = createPlayer("Player X", "X");
    const playerTwo = createPlayer("Player O", "O");

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
  const getPlayers = () => players;

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

  return { board, nextRound, getCurrentRound, getCurrentPlayer, getPlayers }
})();

const gameLogic = (function () {
  function playRound() {
    console.log(`Round ${gameElements.getCurrentRound()}. It is ${gameElements.getCurrentPlayer().name}'s turn.`)
    gameElements.board.printBoard();
  }

  function winDetected(player) {
    player.addScore();
    console.log(`${player.name} wins the game!`)
    console.log(`Winning Board:`)
    gameElements.board.printBoard();
    console.log(`Current Scores:`)
    console.log(`Current Scores: Player X: ${gameElements.getPlayers().playerOne.getScore()}`)
    console.log(`Current Scores: Player O: ${gameElements.getPlayers().playerTwo.getScore()}`)
    console.log(`Starting new game...`)
    gameElements.board.resetBoard()
    playRound();
  }

  function tieDetected() {
    console.log(`It's a Tie!`)
    console.log(`Current Scores:`)
    console.log(`Current Scores: Player X: ${gameElements.getPlayers().playerOne.getScore()}`)
    console.log(`Current Scores: Player O: ${gameElements.getPlayers().playerTwo.getScore()}`)
    console.log(`Starting new game...`)
    gameElements.board.resetBoard()
    playRound();
  }

  return { playRound, winDetected, tieDetected }
})();

const displayController = function () {
  const domElements = function () {
    const domGameBoard = document.querySelector(".game-board");
    return { domGameBoard };
  }();

  function clearGrid() {
    const cells = document.querySelectorAll(".cell");
    for (cell of cells) {
      cell.remove();
    }
  }

  function drawGrid(rows) {
    clearGrid()
    for (const array of rows) {
      for (const item of array) {
        const cell = document.createElement("div");
        cell.textContent = item.getValue();
        cell.classList.add("cell", item.getValue());
        domElements.domGameBoard.appendChild(cell);
      }
    }
  }
  return { drawGrid };
}();

gameLogic.playRound();