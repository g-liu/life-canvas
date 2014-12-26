# constants
SQUARE_SIZE = 30
BOARD_WIDTH = 40
BOARD_HEIGHT = 30

CALC_BUFFER = 2

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

toggleCell = (rawX, rawY) ->
	cellX = Math.floor(rawX / SQUARE_SIZE) + CALC_BUFFER
	cellY = Math.floor(rawY / SQUARE_SIZE) + CALC_BUFFER

	board[cellX][cellY] = !board[cellX][cellY]

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
	# TODO

getLiveNeighbors = (row, col) ->
	# TODO

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

console.log board

# Listen for user input

canvas.addEventListener('click', (evt) ->
	mousePos = getMousePos canvas, evt
	toggleCell mousePos.x, mousePos.y
, false)

document.getElementById('step').addEventListener('click', update, false)
document.getElementById('reset').addEventListener('click', () ->
	ctx.clearRect 0, 0, canvas.width, canvas.height
	drawGrid()
, false)
