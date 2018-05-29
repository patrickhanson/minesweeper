const destination = document.getElementById('game')
destination.addEventListener('click', makeMove)
destination.addEventListener('contextmenu', addFlag)
destination.addEventListener('click', countBombNeighbors)

const flagCounter = document.getElementById('flagcount')
const timerDestination = document.getElementById('timer')

const resetButton = document.getElementById('reset')
resetButton.addEventListener('click', reset)

document.oncontextmenu = function() {
    return false;
}

const resultDestination = document.getElementById('boom')
const neighborOffsets = {
    left: [0, -1],
    right: [0, 1],
    up: [-1, 0],
    down: [1, 0],
    upLeft: [-1, -1],
    upRight: [-1, 1],
    downLeft: [1, -1],
    downRight: [1, 1],
}

const boardElements = []
const queue = []

const gameInit = {
    
}

function drawBoard() {
    const board = new Array(8).fill().map(() => new Array(8).fill())
    for(let rowIndex = 0; rowIndex < board.length; rowIndex++) {
        let gameRow = board[rowIndex]
        const rowDiv = document.createElement('div')
        rowDiv.classList.add('row')
        rowDiv.id = 'row' + rowIndex
        boardElements.push([])
        for(let colIndex = 0; colIndex < gameRow.length; colIndex++) {
            const cell = document.createElement('div')
            boardElements[rowIndex].push(cell)

            cell.dataset.rowIndex = rowIndex
            cell.dataset.colIndex = colIndex
            cell.classList.add('box')
            cell.classList.add('emptybox')
            cell.id = 'col-' + colIndex
            rowDiv.appendChild(cell)
        } 
        destination.appendChild(rowDiv)
    }
}

function bombBoard() {
    for(let i = 0; i < 10; i++) {
        const randomRowIndex = Math.floor(Math.random() * 8)
        const randomColIndex = Math.floor(Math.random() * 8)
        const targetCell = boardElements[randomRowIndex][randomColIndex]
        if (targetCell.className === 'box emptybox') {
            targetCell.classList.remove('emptybox')
            targetCell.classList.add('bomb')
        } else {
            i--
        }
    } 
}

function countBombNeighbors(event) {
    for (let rowIndex = 0; rowIndex < boardElements.length; rowIndex++) {
        for (let colIndex = 0; colIndex < boardElements[rowIndex].length; colIndex++) {
            const givenCell = boardElements[rowIndex][colIndex]

            if (!givenCell.classList.contains('bomb')) {
                for (let neighborOffset of Object.values(neighborOffsets)) {
                    const neighborRowIndex = rowIndex + neighborOffset[0]
                    const neighborColIndex = colIndex + neighborOffset[1]
                    const neighborRow = boardElements[neighborRowIndex]
                    const neighborElement = neighborRow && neighborRow[neighborColIndex]

                    if (neighborElement && neighborElement.classList.contains('bomb')) {
                        if (givenCell.textContent) {
                            givenCell.textContent = Number(givenCell.textContent) + 1
                        } else {
                            givenCell.textContent = 1
                        }
                    }
                }
            }
        }
    }
    destination.removeEventListener('click', countBombNeighbors)
}

function makeMove() {
    let cell = event.target
    if(cell.className === 'box emptybox') {
        cell.classList.remove('box')
    } else if(cell.className === 'box bomb') {
        resultDestination.textContent = 'AYYYYY don\'t worry about that shit fam play again'
        let allBombs = document.querySelectorAll('.box.bomb')
        for(let x = 0; x < allBombs.length; x++) {
            let bomb = allBombs[x]
            bomb.classList.remove('box')
        }
    }
    checkWin()
}

function addFlag() {
    let cell = event.target
    cell.classList.add('flag')
    flagCount()
    checkWin()
}

function checkWin() {
    let winCondition = document.querySelectorAll(".box.bomb.flag")
    let secondWinCondition = document.querySelectorAll(".box")
    if(winCondition.length === 10) {
        resultDestination.textContent = 'AYYYYYY LMAO'
    } else if(secondWinCondition.length === 10) {
        resultDestination.textContent = 'AYYYYYY LMAO'
    }
}

function reset() {
    window.location.reload(true)
}

function flagCount() {
    let flagsLeft = 10
    let flags = document.querySelectorAll('.flag')
    let flagsNumber = Number(flags.length)
    flagCounter.textContent = flagsLeft - flagsNumber
    flagCounter.style.color = 'red'
    flagCounter.style.fontSize = '30px'
    flagCounter.style.fontWeight = 'bold'
}

function timesUp() {
    let time = 0
    function timeCounter() {
        time++
    }
    let timer = setInterval(timeCounter, 1000)
    timerDestination.textContent = String(time)
}

drawBoard()
bombBoard()
flagCount()