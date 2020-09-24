const width = 10
const height = 20;
const grid = document.querySelector('.grid')
let squares = Array.from(document.querySelectorAll('.grid div'))
const scoreDisplay = document.getElementById('score')
const startButton = document.getElementById('start-button')
let nextRandom = 0
let timerId = null
let score = 0
let h2Score = document.getElementById("score-header")

const lTetromino = [
    [1, width + 1, width*2 + 1, 2],
    [width, width + 1, width + 2, width*2 + 2],
    [1, width + 1, width*2 + 1, width*2],
    [width, width*2 , width*2 + 1, width*2 + 2]
]
const zTetromino = [
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1]
]
const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
]
const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
]
const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
]

const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]
let currentPos = 4;
let random = Math.floor(Math.random() * theTetrominoes.length)
let currentRotation = 0;

let current = theTetrominoes[random][currentRotation]

function draw() {
    current.forEach(index => {
        squares[currentPos + index].classList.add('tetromino')
    })
}

function undraw() {
    current.forEach(index => {
        squares[currentPos + index].classList.remove('tetromino')
    })
}

//timerId = setInterval(moveDown, 500)

function control(e) {
    if (e.keyCode === 37)
        moveLeft();
    else if (e.keyCode === 38)
        rotate();
    else if (e.keyCode === 39)
        moveRight();
    else
        moveDown();

}

document.addEventListener('keydown', control)

function moveDown() {
    undraw();
    currentPos += width
    draw()
    freeze(); 
}

function freeze() {
    if (current.some(index => squares[currentPos + index + width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPos + index].classList.add('taken'))
        random = nextRandom
        nextRandom = Math.floor(Math.random() * theTetrominoes.length)
        current = theTetrominoes[random][currentRotation]
        currentPos = 4
        draw()
        displayShape() 
        addScore()
        gameOver();
    }
}

function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(index => (currentPos + index) % width === 0)
    if (!isAtLeftEdge) {
        currentPos--;
    } 
    if (current.some(index => squares[currentPos + index].classList.contains('taken'))) {
        currentPos += 1; 
    }
    draw();
}

function moveRight() {
    undraw()
    const isAtrightEdge = current.some(index => (currentPos + index) % width === width - 1)
    if (!isAtrightEdge) currentPos++
    if (current.some(index => squares[currentPos + index].classList.contains('taken')))
        currentPos--;
    draw();
}

function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation === current.length)
        currentRotation = 0;
    current = theTetrominoes[random][currentRotation]
    draw()
}

const displaySquares = document.querySelectorAll('.mini-grid div')
const displayWidth = 4
let displayIndex = 0

const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2],
    [displayWidth + 1, displayWidth + 2, displayWidth * 2, displayWidth * 2 + 1],
    [1, displayWidth, displayWidth + 1, displayWidth + 2],
    [0, 1, displayWidth, displayWidth + 1],
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1]
]

function displayShape() {
    displaySquares.forEach(square => {
        square.classList.remove('tetromino')
    })
   upNextTetrominoes[nextRandom].forEach(index => {
        displaySquares[displayIndex + index].classList.add('tetromino')
    })
}

startButton.addEventListener("click", () => {
    if (timerId) {
        clearInterval(timerId)
        timerId = null
    } else {
        draw()
        timerId = setInterval(moveDown, 1000)
       // nextRandom = Math.floor(Math.random() * theTetrominoes.length)
        displayShape()
    }

})

function addScore() {
    for (let i = 0; i < 199; i += width) {
        const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]
        if (row.every(index => squares[index].classList.contains('taken'))) {
            score += 10
            scoreDisplay.textContent = score
            row.forEach(index => {
                squares[index].classList.remove('taken')
                squares[index].classList.remove('tetromino')
            })
            const squaresRemoved = squares.splice(i, width)
            squares = squaresRemoved.concat(squares)
            squares.forEach(cell => grid.appendChild(cell))

        }
    }
}
function gameOver() {
    if (current.some(index => squares[currentPos + index].classList.contains('taken'))) {
        h2Score.textContent = "The End!"
        scoreDisplay.innerHTML = ''
        clearInterval(timerId)
        document.removeEventListener("keydown", control);
    }
}
  