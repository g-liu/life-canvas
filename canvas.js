(function() {
  var BOARD_HEIGHT, BOARD_WIDTH, CALC_BUFFER, SQUARE_SIZE, board, canvas, clearCell, ctx, drawGrid, drawLine, fillCell, getLiveNeighbors, getMousePos, i, j, ref, toggleCell, update;

  SQUARE_SIZE = 30;

  BOARD_WIDTH = 40;

  BOARD_HEIGHT = 30;

  CALC_BUFFER = 2;

  drawGrid = function() {
    var i, j, k, ref, ref1, ref2, ref3, results;
    for (i = j = 0.5, ref = canvas.width + 0.5, ref1 = SQUARE_SIZE; ref1 > 0 ? j <= ref : j >= ref; i = j += ref1) {
      drawLine(ctx, i, 0, i, canvas.height);
    }
    results = [];
    for (i = k = 0.5, ref2 = canvas.height + 0.5, ref3 = SQUARE_SIZE; ref3 > 0 ? k <= ref2 : k >= ref2; i = k += ref3) {
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

  update = function() {};

  getLiveNeighbors = function(row, col) {};

  canvas = document.getElementById('board');

  canvas.width = SQUARE_SIZE * BOARD_WIDTH + 1;

  canvas.height = SQUARE_SIZE * BOARD_HEIGHT + 1;

  ctx = canvas.getContext('2d');

  ctx.strokeStyle = '#ccc';

  ctx.fillStyle = 'red';

  drawGrid();

  board = new Array(BOARD_HEIGHT + 2 * CALC_BUFFER);

  for (i = j = 0, ref = board.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
    board[i] = new Array(BOARD_WIDTH + 2 * CALC_BUFFER);
  }

  canvas.addEventListener('click', function(evt) {
    var mousePos;
    mousePos = getMousePos(canvas, evt);
    return toggleCell(mousePos.x, mousePos.y);
  }, false);

  document.getElementById('step').addEventListener('click', update, false);

  document.getElementById('reset').addEventListener('click', function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return drawGrid();
  }, false);

}).call(this);
