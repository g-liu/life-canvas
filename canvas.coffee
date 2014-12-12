# constants
SQUARE_SIZE = 20
BOARD_WIDTH = 40
BOARD_HEIGHT = 30

CALC_BUFFER = 2

# functions
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
	x = (cellX - CALC_BUFFER) * SQUARE_SIZE + 1
	y = (cellY - CALC_BUFFER) * SQUARE_SIZE + 1

	# toggle bit in active
	idx = -1
	if typeof active[cellY] is 'undefined'
		active[cellY] = []
	else
		idx = active[cellY].indexOf(cellX)

	if idx == -1
		fillCell x, y
		active[cellY].unshift cellX
	else
		clearCell x, y
		if active[cellY].length == 1
			active.splice cellY, cellY + 1
		else
			active[cellY].splice idx, idx + 1

fillCell = (x, y) ->
	ctx.fillRect x+.5, y+.5, SQUARE_SIZE - 1.5, SQUARE_SIZE - 1.5

clearCell = (x, y) ->
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

# initialize the representation

# holds all active cells as a list of pairs
active = []

ctx = canvas.getContext('2d')

ctx.strokeStyle = '#ccc'
ctx.fillStyle = 'red'

# draw grid
drawLine ctx, i, 0, i, canvas.height for i in [0.5..canvas.width+0.5] by SQUARE_SIZE
drawLine ctx, 0, i, canvas.width, i for i in [0.5..canvas.height+0.5] by SQUARE_SIZE

# Listen for user input

canvas.addEventListener('click', (evt) ->
	mousePos = getMousePos canvas, evt
	toggleCell mousePos.x, mousePos.y
, false)

document.getElementById('step').addEventListener('click', update, false)
