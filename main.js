let timer = null
const destination = document.getElementById('game')
destination.addEventListener('click', makeMove)
destination.addEventListener('contextmenu', addFlag)

const flagCounter = document.getElementById('flagcount')
const timerDestination = document.getElementById('timer')

const resetButton = document.getElementById('reset')

resetButton.addEventListener('click', reset)

document.oncontextmenu = function() {
    return false;
}

const resultDestination = document.getElementById('boom')
const neighborOffsets = Object.values({
    left: [0, -1],
    right: [0, 1],
    up: [-1, 0],
    down: [1, 0],
    upLeft: [-1, -1],
    upRight: [-1, 1],
    downLeft: [1, -1],
    downRight: [1, 1],
})

const boardElements = []

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
            cell.classList.add('box', 'emptybox')
            rowDiv.appendChild(cell)
        } 
        destination.appendChild(rowDiv)
    }

    return boardElements
}

function bombBoard() {
    for(let i = 0; i < 10; i++) {
        const randomRowIndex = Math.floor(Math.random() * 8)
        const randomColIndex = Math.floor(Math.random() * 8)
        const targetCell = boardElements[randomRowIndex][randomColIndex]
        if (targetCell.classList.contains('box') && targetCell.classList.contains('emptybox')) {
            targetCell.classList.replace('emptybox', 'bomb')
            targetCell.isABomb = true
        } else {
            i--
        }
    } 

    return boardElements
}

function countBombNeighbors() {
    for (let rowIndex = 0; rowIndex < boardElements.length; rowIndex++) {
        for (let colIndex = 0; colIndex < boardElements[rowIndex].length; colIndex++) {
            const givenCell = boardElements[rowIndex][colIndex]

            if (!givenCell.isABomb) {
                for (let neighborOffset of neighborOffsets) {
                    const neighborRowIndex = rowIndex + neighborOffset[0]
                    const neighborColIndex = colIndex + neighborOffset[1]
                    const neighborRow = boardElements[neighborRowIndex]
                    const neighborElement = neighborRow && neighborRow[neighborColIndex]

                    if (neighborElement && neighborElement.isABomb) {
                        if (givenCell.textContent) {
                            givenCell.bombCount = givenCell.textContent = Number(givenCell.textContent) + 1
                            givenCell.style.color = "rgb(34, 12, 179)"
                            givenCell.style.fontSize = '16px'
                        } else {
                            givenCell.bombCount = givenCell.textContent = 1
                            givenCell.style.color = "rgb(34, 12, 179)"
                            givenCell.style.fontSize = '14px'
                        }
                    }
                }
            }
        }
    }
}

function revealSquare(cell) {
    cell.classList.remove('box')
    cell.hasBeenClicked = true
}

function makeMove(event) {
    let cell = event.target
    if (cell.className === 'box emptybox') {
        revealSquare(cell)

        if (!cell.bombCount) {
            fill(cell)
        }

    } else if(cell.className === 'box bomb') {
        resultDestination.textContent = 'AYYYYY don\'t worry about that shit fam play again'
        let allBombs = document.querySelectorAll('.box.bomb')
        for(let x = 0; x < allBombs.length; x++) {
            let bomb = allBombs[x]
            bomb.classList.remove('box')
        }
        clearInterval(timer)
    }
    checkWin()
}

function addFlag(event) {
    let cell = event.target
    cell.classList.toggle('flag')
    flagCount()
    checkWin()
}

function checkWin() {
    let winCondition = document.querySelectorAll(".box.bomb.flag")
    let secondWinCondition = document.querySelectorAll(".box")
    let numberOfFlags = document.querySelectorAll('.flag')
    if(winCondition.length === 10 && numberOfFlags.length === 10) {
        resultDestination.textContent = 'AYYYYYY LMAO you win'
        clearInterval(timer)
    } else if(secondWinCondition.length === 10) {
        resultDestination.textContent = 'AYYYYYY LMAO you win'
        clearInterval(timer)
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

const timeCounter = () => timerDestination.textContent = time++
let time = 0

function timesUp() {
    

    timer = window.setInterval(timeCounter, 1000)
    timerDestination.style.color = 'red'
    timerDestination.style.fontSize = '30px'
    timerDestination.style.fontWeight = 'bold'
}

function fill(cell) {
    const queue = []
    cell.hasBeenQueued = true
    queue.push(cell)

    while(queue.length) {
        const cell = queue.shift()
        const rowIndex = Number(cell.dataset.rowIndex)
        const colIndex = Number(cell.dataset.colIndex)
        
        neighborOffsets.forEach(offset => {
            const rowOffset = offset[0]
            const colOffset = offset[1]
            
            const neighborRow = boardElements[rowIndex + rowOffset]
            const neighborCell = neighborRow && neighborRow[colIndex + colOffset]

            if (!neighborCell || neighborCell.hasBeenClicked || neighborCell.isABomb) return
            
            revealSquare(neighborCell)
            
            if (!neighborCell.hasBeenQueued && !neighborCell.bombCount) {
                neighborCell.hasBeenQueued = true
                queue.push(neighborCell)
            }
        })
    }
}

countBombNeighbors(bombBoard(drawBoard()))
flagCount()
timesUp()