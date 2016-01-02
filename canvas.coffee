# constants
SQUARE_SIZE = 30
BOARD_WIDTH = 40
BOARD_HEIGHT = 30

CALC_BUFFER = 2
STEP_BUFFER_SIZE = 2

# functions
drawGrid = () ->
  drawLine ctx, i, 0, i, canvas.height for i in [0.5..canvas.width+0.5] by SQUARE_SIZE
  drawLine ctx, 0, i, canvas.width, i for i in [0.5..canvas.height+0.5] by SQUARE_SIZE
drawLine = (ctx, sx, sy, fx, fy) ->
  ctx.moveTo(sx, sy)
  ctx.lineTo(fx, fy)
  ctx.stroke()
getMousePos = (canvas, evt) ->
  rect = canvas.getBoundingClientRect()
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  }

updateCells = () ->
  for boardRow, i in board
    for boardCell, j in boardRow
      if boardCell
        fillCell i, j
      else
        clearCell i, j

  # to quit JSLint from complaining
  undefined

toggleCell = (rawX, rawY) ->
  cellX = Math.floor(rawX / SQUARE_SIZE) + CALC_BUFFER
  cellY = Math.floor(rawY / SQUARE_SIZE) + CALC_BUFFER

  board[cellX][cellY] = !board[cellX][cellY]

  # TODO: should be called from event handler
  if board[cellX][cellY]
    fillCell rawX, rawY
  else
    clearCell rawX, rawY

fillCell = (rawX, rawY) ->
  x = Math.floor(rawX / SQUARE_SIZE) * SQUARE_SIZE + 1
  y = Math.floor(rawY / SQUARE_SIZE) * SQUARE_SIZE + 1
  ctx.fillRect x, y, SQUARE_SIZE - 1, SQUARE_SIZE - 1

clearCell = (rawX, rawY) ->
  x = Math.floor(rawX / SQUARE_SIZE) * SQUARE_SIZE + 1
  y = Math.floor(rawY / SQUARE_SIZE) * SQUARE_SIZE + 1
  ctx.clearRect x, y, SQUARE_SIZE - 1, SQUARE_SIZE - 1

update = () ->
  console.log board
  for i in [0..board.length-1]
    bufferRow = STEP_BUFFER_SIZE - 1
    if i < STEP_BUFFER_SIZE
      bufferRow = i
    else
      # need to write the contents of the first row of the buffer
      # into the (i - STEP_BUFFER_SIZE)th row of the board
      boardWrite = stepBuffer.shift()
      for col in [0..boardWrite.length-1]
        board[i-STEP_BUFFER_SIZE][col] = boardWrite[col]

      # add a new row to the buffer
      stepBuffer.push(new Array(BOARD_WIDTH+2*CALC_BUFFER))

    for j in [0..board[i].length-1]
      thisCellIsLive = isLive(i, j)
      liveList = getLiveNeighbors(i, j)

      stepBuffer[bufferRow][j] = applyRules(thisCellIsLive, liveList)

  # buffer still stores the last STEP_BUFFER_SIZE calculated rows,
  # so we need to write those into the board
  for buffI in [0..stepBuffer.length-1]
    for buffJ in [0..stepBuffer[buffI].length-1]
      board[board.length-STEP_BUFFER_SIZE+buffI][buffJ] = stepBuffer[buffI][buffJ]

  console.log board

  # TODO: should be called from event handler
  updateCells()

getLiveNeighbors = (row, col) ->
  live = []
  for i in [row-1..row+1]
    for j in [col-1..col+1]
      if isLive(i, j)
        live.push([i, j])

  return live

isLive = (row, col) ->
  if isInBounds(row, col)
    return board[row][col] == true

  return false

isInBounds = (row, col) ->
  return row >= 0 && col >= 0 && row < board.length && col < board[row].length

applyRules = (cellLive, liveList) ->
  numAlive = liveList.length
  if numAlive < 2 && cellLive
    return false
  if 2 <= numAlive <= 3 && cellLive
    return true
  if numAlive > 3 && cellLive
    return false
  if !cellLive && numAlive == 3
    return true

# MAIN CODE
# set board size

canvas = document.getElementById('board')
canvas.width = SQUARE_SIZE * BOARD_WIDTH + 1
canvas.height = SQUARE_SIZE * BOARD_HEIGHT + 1

ctx = canvas.getContext('2d')
ctx.strokeStyle = '#ccc'
ctx.fillStyle = 'red'

drawGrid()

board = new Array(BOARD_HEIGHT+2*CALC_BUFFER)
board[i] = new Array(BOARD_WIDTH+2*CALC_BUFFER) for i in [0..board.length-1]

stepBuffer = new Array(STEP_BUFFER_SIZE)
stepBuffer[i] = new Array(BOARD_WIDTH+2*CALC_BUFFER) for i in [0..stepBuffer.length-1]

# Listen for user input

canvas.addEventListener('click', (evt) ->
  mousePos = getMousePos canvas, evt
  toggleCell mousePos.x, mousePos.y
, false)

document.getElementById('step').addEventListener('click', update, false)
document.getElementById('reset').addEventListener('click', () ->
  ctx.clearRect 0, 0, canvas.width, canvas.height
  drawGrid()

  board = new Array(BOARD_HEIGHT+2*CALC_BUFFER)
  board[i] = new Array(BOARD_WIDTH+2*CALC_BUFFER) for i in [0..board.length-1]
, false)
