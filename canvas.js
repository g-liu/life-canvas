// Generated by CoffeeScript 1.8.0
(function() {
  var BOARD_HEIGHT, BOARD_WIDTH, CALC_BUFFER, SQUARE_SIZE, active, canvas, clearCell, ctx, drawLine, fillCell, getLiveNeighbors, getMousePos, i, toggleCell, update, _i, _j, _ref, _ref1;

  SQUARE_SIZE = 20;

  BOARD_WIDTH = 40;

  BOARD_HEIGHT = 30;

  CALC_BUFFER = 2;

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
    var cellX, cellY, idx, x, y;
    cellX = Math.floor(rawX / SQUARE_SIZE) + CALC_BUFFER;
    cellY = Math.floor(rawY / SQUARE_SIZE) + CALC_BUFFER;
    x = (cellX - CALC_BUFFER) * SQUARE_SIZE + 1;
    y = (cellY - CALC_BUFFER) * SQUARE_SIZE + 1;
    idx = -1;
    if (typeof active[cellY] === 'undefined') {
      active[cellY] = [];
    } else {
      idx = active[cellY].indexOf(cellX);
    }
    if (idx === -1) {
      fillCell(x, y);
      return active[cellY].unshift(cellX);
    } else {
      clearCell(x, y);
      if (active[cellY].length === 1) {
        return active.splice(cellY, cellY + 1);
      } else {
        return active[cellY].splice(idx, idx + 1);
      }
    }
  };

  fillCell = function(x, y) {
    return ctx.fillRect(x + .5, y + .5, SQUARE_SIZE - 1.5, SQUARE_SIZE - 1.5);
  };

  clearCell = function(x, y) {
    return ctx.clearRect(x, y, SQUARE_SIZE - 1, SQUARE_SIZE - 1);
  };

  update = function() {};

  getLiveNeighbors = function(row, col) {};

  canvas = document.getElementById('board');

  canvas.width = SQUARE_SIZE * BOARD_WIDTH + 1;

  canvas.height = SQUARE_SIZE * BOARD_HEIGHT + 1;

  active = [];

  ctx = canvas.getContext('2d');

  ctx.strokeStyle = '#ccc';

  ctx.fillStyle = 'red';

  for (i = _i = 0.5, _ref = canvas.width + 0.5; SQUARE_SIZE > 0 ? _i <= _ref : _i >= _ref; i = _i += SQUARE_SIZE) {
    drawLine(ctx, i, 0, i, canvas.height);
  }

  for (i = _j = 0.5, _ref1 = canvas.height + 0.5; SQUARE_SIZE > 0 ? _j <= _ref1 : _j >= _ref1; i = _j += SQUARE_SIZE) {
    drawLine(ctx, 0, i, canvas.width, i);
  }

  canvas.addEventListener('click', function(evt) {
    var mousePos;
    mousePos = getMousePos(canvas, evt);
    return toggleCell(mousePos.x, mousePos.y);
  }, false);

  document.getElementById('step').addEventListener('click', update, false);

}).call(this);