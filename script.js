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
    let winningCell = false;
    const getValue = () => value;
    const writeValue = () => value = gameElements.getCurrentPlayer().marker;
    const resetValue = () => value = 0;
    const setWinningCell = () => winningCell = "winning-cell";
    const winningCellValue = () => winningCell;
    return { x, y, getValue, writeValue, resetValue, winningCellValue, setWinningCell };
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
      if (checkBoardStatus()) {
        gameLogic.winDetected(gameElements.getCurrentPlayer(), checkBoardStatus())
      } else gameElements.nextRound();
    }
  }

  function checkBoardStatus() {
    for (const row of gridRows) {
      if (threeValuesEqual(row[0], row[1], row[2])) return [row[0], row[1], row[2]];
      if (checkColumn(gridRows.indexOf(row))) return checkColumn(gridRows.indexOf(row));
    }
    function checkColumn(column) {
      const columnValues = [];
      for (const row of gridRows) {
        columnValues.push(row[column])
      }
      if (threeValuesEqual(columnValues[0], columnValues[1], columnValues[2])) return [columnValues[0], columnValues[1], columnValues[2]];
    }
    const gridCornerValues = [gridRows[0][0], gridRows[0][2], gridRows[2][0], gridRows[2][2]];
    const gridCenterValue = gridRows[1][1];

    if (threeValuesEqual(gridCornerValues[0], gridCenterValue, gridCornerValues[3])) return [gridCornerValues[0], gridCenterValue, gridCornerValues[3]];
    if (threeValuesEqual(gridCornerValues[2], gridCenterValue, gridCornerValues[1])) return [gridCornerValues[2], gridCenterValue, gridCornerValues[1]];

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
    if (value1.getValue() === value2.getValue() && value2.getValue() === value3.getValue() && value1.getValue()) return [value1, value2, value3]; else return false;
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
  function resetRound() { currentRound = 1 };

  function switchCurrentPlayer() {
    if (currentPlayer === players.playerOne) {
      currentPlayer = players.playerTwo;
    } else {
      currentPlayer = players.playerOne;
    }
  }

  return { board, nextRound, getCurrentRound, resetRound, getCurrentPlayer, getPlayers }
})();

const gameLogic = (function () {
  function playRound() {
    console.log(`Round ${gameElements.getCurrentRound()}. It is ${gameElements.getCurrentPlayer().name}'s turn.`)
    gameElements.board.printBoard();
  }

  function winDetected(player, winningCells) {
    for (const cell of winningCells) {
      cell.setWinningCell();
    }
    displayController.drawOverlay(winningCells);
    player.addScore();
    console.log(`${player.name} wins the game!`)
    console.log(`Winning Board:`)
    gameElements.board.printBoard();
    newGame()
    playRound();
  }

  function tieDetected() {
    console.log(`It's a Tie!`)

    newGame()
    playRound();
  }

  function newGame() {
    console.log(`Current Scores:`)
    console.log(`Current Scores: Player X: ${gameElements.getPlayers().playerOne.getScore()}`)
    console.log(`Current Scores: Player O: ${gameElements.getPlayers().playerTwo.getScore()}`)
    console.log(`Starting new game...`)
    gameElements.resetRound()
    // gameElements.board.resetBoard()
  }

  return { playRound, winDetected, tieDetected }
})();

const displayController = function () {
  const domElements = function () {
    const domGameBoard = document.querySelector(".game-board");
    const canvasOverlay = document.querySelector(".canvas-overlay");
    const canvasOverlayContainer = document.querySelector(".canvas-overlay-container");
    const alertOverlayContainer = document.querySelector(".alert-overlay-container");
    return { domGameBoard, canvasOverlay, canvasOverlayContainer, alertOverlayContainer };
  }();

  function displayOverlay() {
    domElements.canvasOverlayContainer.style.visibility = "visible";
    domElements.alertOverlayContainer.style.visibility = "visible";
  };

  function assignImg(input) {
    if (input) {
      const marker = document.createElement("div");
      const markers = {
        X: "X",
        O: "O",
      }
      marker.textContent = markers[input];
      return marker;
    } else return document.createElement("div");
  };

  function clearGrid() {
    const cells = document.querySelectorAll(".cell");
    for (const cell of cells) {
      cell.remove();
    }
  }

  function drawCell(x, y, cellItem) {
    const genCell = document.createElement("div");
    genCell.setAttribute("data-x", x.indexOf(y));
    genCell.setAttribute("data-y", y.indexOf(cellItem));
    genCell.classList.add(cellItem.winningCellValue());
    const img = assignImg(cellItem.getValue());
    genCell.classList.add("cell", cellItem.getValue());
    genCell.appendChild(img);
    return (genCell);
  }

  function cellClickDetector(cell) {
    const cellX = cell.dataset.x;
    const cellY = cell.dataset.y;
    gameElements.board.placeMarker(cellX, cellY);
  }

  function drawGrid(rows) {
    clearGrid()
    for (const array of rows) {
      for (const item of array) {
        const domCell = drawCell(rows, array, item);
        domCell.addEventListener("click", () => cellClickDetector(domCell));
        domElements.domGameBoard.appendChild(domCell);
      }
    }
  }

  function drawOverlay(winningCells) {
    displayOverlay();
    const cellCoords = function cellsToCoordinates() {
      console.log(winningCells);
      const firstCell = winningCells[0];
      const lastCell = winningCells[2];
      const canvasSize = 440;
      function convertCanvasCoord(cellxy) {
        if (cellxy === 0) return 10; else if (cellxy === 2) return 430; else return cellxy * canvasSize / 2;
      };
      const firstX = convertCanvasCoord(firstCell.x);
      const firstY = convertCanvasCoord(firstCell.y);
      const lastX = convertCanvasCoord(lastCell.x);
      const lastY = convertCanvasCoord(lastCell.y);
      return { firstX, firstY, lastX, lastY }
    }();
    const pen = domElements.canvasOverlay.getContext("2d");
    pen.moveTo(cellCoords.firstY, cellCoords.firstX);
    console.log(cellCoords.firstX, cellCoords.firstY);
    pen.lineTo(cellCoords.lastY, cellCoords.lastX);
    console.log(cellCoords.lastX, cellCoords.lastY);
    pen.lineWidth = 10;
    pen.strokeStyle = 'green';
    pen.stroke();
  }

  return { drawGrid, drawOverlay, displayOverlay };
}();

gameLogic.playRound();