(function() {
  var BOARD_HEIGHT, BOARD_WIDTH, CALC_BUFFER, SQUARE_SIZE, STEP_BUFFER_SIZE, applyRules, board, canvas, clearCell, ctx, drawGrid, drawLine, fillCell, getLiveNeighbors, getMousePos, i, isInBounds, isLive, k, l, ref, ref1, stepBuffer, toggleCell, update, updateCells;

  SQUARE_SIZE = 30;

  BOARD_WIDTH = 40;

  BOARD_HEIGHT = 30;

  CALC_BUFFER = 2;

  STEP_BUFFER_SIZE = 2;

  drawGrid = function() {
    var i, k, l, ref, ref1, ref2, ref3, results;
    for (i = k = 0.5, ref = canvas.width + 0.5, ref1 = SQUARE_SIZE; ref1 > 0 ? k <= ref : k >= ref; i = k += ref1) {
      drawLine(ctx, i, 0, i, canvas.height);
    }
    results = [];
    for (i = l = 0.5, ref2 = canvas.height + 0.5, ref3 = SQUARE_SIZE; ref3 > 0 ? l <= ref2 : l >= ref2; i = l += ref3) {
      results.push(drawLine(ctx, 0, i, canvas.width, i));
    }
    return results;
  };

  drawLine = function(ctx, sx, sy, fx, fy) {
    ctx.moveTo(sx, sy);
    ctx.lineTo(fx, fy);
    return ctx.stroke();
  };

  getMousePos = function(canvas, evt) {
    var rect;
    rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  };

  updateCells = function() {
    var boardCell, boardRow, i, j, k, l, len, len1;
    for (i = k = 0, len = board.length; k < len; i = ++k) {
      boardRow = board[i];
      for (j = l = 0, len1 = boardRow.length; l < len1; j = ++l) {
        boardCell = boardRow[j];
        if (boardCell) {
          fillCell(i, j);
        } else {
          clearCell(i, j);
        }
      }
    }
    return void 0;
  };

  toggleCell = function(rawX, rawY) {
    var cellX, cellY;
    cellX = Math.floor(rawX / SQUARE_SIZE) + CALC_BUFFER;
    cellY = Math.floor(rawY / SQUARE_SIZE) + CALC_BUFFER;
    board[cellX][cellY] = !board[cellX][cellY];
    if (board[cellX][cellY]) {
      return fillCell(rawX, rawY);
    } else {
      return clearCell(rawX, rawY);
    }
  };

  fillCell = function(rawX, rawY) {
    var x, y;
    x = Math.floor(rawX / SQUARE_SIZE) * SQUARE_SIZE + 1;
    y = Math.floor(rawY / SQUARE_SIZE) * SQUARE_SIZE + 1;
    return ctx.fillRect(x, y, SQUARE_SIZE - 1, SQUARE_SIZE - 1);
  };

  clearCell = function(rawX, rawY) {
    var x, y;
    x = Math.floor(rawX / SQUARE_SIZE) * SQUARE_SIZE + 1;
    y = Math.floor(rawY / SQUARE_SIZE) * SQUARE_SIZE + 1;
    return ctx.clearRect(x, y, SQUARE_SIZE - 1, SQUARE_SIZE - 1);
  };

  update = function() {
    var boardWrite, buffI, buffJ, bufferRow, col, i, j, k, l, liveList, m, n, o, ref, ref1, ref2, ref3, ref4, thisCellIsLive;
    console.log(board);
    for (i = k = 0, ref = board.length - 1; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
      bufferRow = STEP_BUFFER_SIZE - 1;
      if (i < STEP_BUFFER_SIZE) {
        bufferRow = i;
      } else {
        boardWrite = stepBuffer.shift();
        for (col = l = 0, ref1 = boardWrite.length - 1; 0 <= ref1 ? l <= ref1 : l >= ref1; col = 0 <= ref1 ? ++l : --l) {
          board[i - STEP_BUFFER_SIZE][col] = boardWrite[col];
        }
        stepBuffer.push(new Array(BOARD_WIDTH + 2 * CALC_BUFFER));
      }
      for (j = m = 0, ref2 = board[i].length - 1; 0 <= ref2 ? m <= ref2 : m >= ref2; j = 0 <= ref2 ? ++m : --m) {
        thisCellIsLive = isLive(i, j);
        liveList = getLiveNeighbors(i, j);
        stepBuffer[bufferRow][j] = applyRules(thisCellIsLive, liveList);
      }
    }
    for (buffI = n = 0, ref3 = stepBuffer.length - 1; 0 <= ref3 ? n <= ref3 : n >= ref3; buffI = 0 <= ref3 ? ++n : --n) {
      for (buffJ = o = 0, ref4 = stepBuffer[buffI].length - 1; 0 <= ref4 ? o <= ref4 : o >= ref4; buffJ = 0 <= ref4 ? ++o : --o) {
        board[board.length - STEP_BUFFER_SIZE + buffI][buffJ] = stepBuffer[buffI][buffJ];
      }
    }
    console.log(board);
    return updateCells();
  };

  getLiveNeighbors = function(row, col) {
    var i, j, k, l, live, ref, ref1, ref2, ref3;
    live = [];
    for (i = k = ref = row - 1, ref1 = row + 1; ref <= ref1 ? k <= ref1 : k >= ref1; i = ref <= ref1 ? ++k : --k) {
      for (j = l = ref2 = col - 1, ref3 = col + 1; ref2 <= ref3 ? l <= ref3 : l >= ref3; j = ref2 <= ref3 ? ++l : --l) {
        if (isLive(i, j)) {
          live.push([i, j]);
        }
      }
    }
    return live;
  };

  isLive = function(row, col) {
    if (isInBounds(row, col)) {
      return board[row][col] === true;
    }
    return false;
  };

  isInBounds = function(row, col) {
    return row >= 0 && col >= 0 && row < board.length && col < board[row].length;
  };

  applyRules = function(cellLive, liveList) {
    var numAlive;
    numAlive = liveList.length;
    if (numAlive < 2 && cellLive) {
      return false;
    }
    if ((2 <= numAlive && numAlive <= 3) && cellLive) {
      return true;
    }
    if (numAlive > 3 && cellLive) {
      return false;
    }
    if (!cellLive && numAlive === 3) {
      return true;
    }
  };

  canvas = document.getElementById('board');

  canvas.width = SQUARE_SIZE * BOARD_WIDTH + 1;

  canvas.height = SQUARE_SIZE * BOARD_HEIGHT + 1;

  ctx = canvas.getContext('2d');

  ctx.strokeStyle = '#ccc';

  ctx.fillStyle = 'red';

  drawGrid();

  board = new Array(BOARD_HEIGHT + 2 * CALC_BUFFER);

  for (i = k = 0, ref = board.length - 1; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
    board[i] = new Array(BOARD_WIDTH + 2 * CALC_BUFFER);
  }

  stepBuffer = new Array(STEP_BUFFER_SIZE);

  for (i = l = 0, ref1 = stepBuffer.length - 1; 0 <= ref1 ? l <= ref1 : l >= ref1; i = 0 <= ref1 ? ++l : --l) {
    stepBuffer[i] = new Array(BOARD_WIDTH + 2 * CALC_BUFFER);
  }

  canvas.addEventListener('click', function(evt) {
    var mousePos;
    mousePos = getMousePos(canvas, evt);
    return toggleCell(mousePos.x, mousePos.y);
  }, false);

  document.getElementById('step').addEventListener('click', update, false);

  document.getElementById('reset').addEventListener('click', function() {
    var m, ref2, results;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    board = new Array(BOARD_HEIGHT + 2 * CALC_BUFFER);
    results = [];
    for (i = m = 0, ref2 = board.length - 1; 0 <= ref2 ? m <= ref2 : m >= ref2; i = 0 <= ref2 ? ++m : --m) {
      results.push(board[i] = new Array(BOARD_WIDTH + 2 * CALC_BUFFER));
    }
    return results;
  }, false);

}).call(this);
