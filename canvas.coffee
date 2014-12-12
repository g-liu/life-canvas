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

	# toggle bit in active
	idx = -1
	if typeof active[cellY] is 'undefined'
		active[cellY] = []
	else
		idx = active[cellY].indexOf(cellX)

	if idx == -1
		fillCell rawX, rawY
		active[cellY].unshift cellX
	else
		clearCell rawX, rawY
		if active[cellY].length == 1
			active.splice cellY, cellY + 1
		else
			active[cellY].splice idx, idx + 1

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
	neighborList = []
	# check top and bottom
	for r in [row-1..row+1] by 2
		if typeof active[r] != 'undefined'
			for i in [col-1..col+1]
				if typeof active[r][i] != 'undefined'
					neighborList.add active[r][i]

	# check same row
	if typeof active[row][col-1] != undefined
		neighborList.add active[row][col-1]
	if typeof active[row][col+1] != undefined
		neighborList.add active[row][col+1]

	return neighborList

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

drawGrid()

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
