document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const width = 12
  const scoreDisplay = document.querySelector('#score')
  const startButton = document.querySelector('#start-pause')
  const clearButton = document.querySelector('#clear')
  const status = document.querySelector('#status')
  let nextRandom = 0
  let timerId
  const speed = [900, 800, 700, 600, 500, 400, 300, 200, 100, 50]
  const level = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  let score = 0
  const colors = [
    '#716cfc',
    '#9b2630',
    '#d66fd1',
    '#aa6203',
    '#519661',
    '#8be04e',
    '#1e1b80'
  ]

  // The Tetrominoes and their rotations
  const jTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
  ]

  const iTetromino = [
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1]
  ]

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ]

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
  ]

  const zTetromino = [
    [1, width, width + 1, width * 2],
    [width, width + 1, width * 2 + 1, width * 2 + 2],
    [1, width, width + 1, width * 2],
    [width, width + 1, width * 2 + 1, width * 2 + 2]
  ]

  const sTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
  ]

  const lTetromino = [
    [0, 1, width + 1, width * 2 + 1],
    [width, width + 1, width + 2, 2],
    [1, width + 1, width * 2 + 1, width * 2 + 2],
    [0, 1, 2, width]
  ]

  // All Tetrominoes together
  const theTetrominoes = [jTetromino, iTetromino, oTetromino, tTetromino, zTetromino, sTetromino, lTetromino]

  let currentPosition = 5
  let currentRotation = 0
  let currentLevel = level[0]

  // Randomly select a Tetromino and its first rotation
  let randomTetromino = Math.floor(Math.random() * theTetrominoes.length)
  let currentTetromino = theTetrominoes[randomTetromino][currentRotation]

  // Draw the random Tetromino
  function draw() {
    currentTetromino.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino')
      squares[currentPosition + index].style.backgroundColor = colors[randomTetromino]
    })
  }
  // Undraw the tetromino
  function undraw() {
    currentTetromino.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino')
      squares[currentPosition + index].style.backgroundColor = ''
    })
  }

  // Assign function to keycodes
  function control(e) {
    if (e.keyCode === 37) {
      // Move left
      moveLeft()
    } else if (e.keyCode === 38) {
      // Rotate
      rotate()
    } else if (e.keyCode === 39) {
      // Move right
      moveRight()
    } else if (e.keyCode === 40) {
      // Move down faster
      moveDown()
    }
  }

  // Make the Tetrominoes move down every second
  function moveDown() {
    undraw()
    currentPosition += width
    draw()
    freeze()
  }

  // Stop Tetrominoes at the bottom of the grid
  function freeze() {
    if (currentTetromino.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      currentTetromino.forEach(index => squares[currentPosition + index].classList.add('taken'))
      // Drops another random Tetromino
      randomTetromino = nextRandom
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      currentTetromino = theTetrominoes[randomTetromino][currentRotation]
      currentPosition = 5
      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }

  // Moving left or right until the edges of the grid or blockages
  function moveLeft() {
    undraw()
    const leftEdge = currentTetromino.some(index => (currentPosition + index) % width === 0)
    if (!leftEdge) {
      currentPosition -= 1
    }
    if (currentTetromino.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition += 1
    }
    draw()
  }

  function moveRight() {
    undraw()
    const rightEdge = currentTetromino.some(index => (currentPosition + index + 1) % width === 0)
    if (!rightEdge) {
      currentPosition += 1
    }
    if (currentTetromino.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -= 1
    }
    draw()
  }

  // Check rotation at the edges
  function isAtRight() {
    return currentTetromino.some(index => (currentPosition + index + 1) % width === 0)
  }

  function isAtLeft() {
    return currentTetromino.some(index => (currentPosition + index) % width === 0)
  }

  function checkRotatedPosition(P) {
    P = P || currentPosition
    if ((P + 1) % width < 5) {
      if (isAtRight()) {
        currentPosition += 1
        checkRotatedPosition(P) // Check again
      }
    } else if (P % width > 6) {
      if (isAtLeft()) {
        currentPosition -= 1
        checkRotatedPosition(P)
      }
    }
  }
  // Rotate the Tetrominoes
  function rotate() {
    undraw()
    currentRotation++
    if (currentRotation === 4) {
      currentRotation = 0
    }
    currentTetromino = theTetrominoes[randomTetromino][currentRotation]
    checkRotatedPosition()
    draw()
  }

  // Show next Tetromino in the mini-grid
  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  const displayIndex = 0

  // The Tetrominoes without rotations
  const upNextTetromino = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], // jTetromino
    [displayWidth, displayWidth + 1, displayWidth + 2, displayWidth + 3], // iTetromino
    [0, 1, displayWidth, displayWidth + 1], // oTetromino
    [1, displayWidth, displayWidth + 1, displayWidth + 2], // tTetromino
    [1, displayWidth, displayWidth + 1, displayWidth * 2], // zTetromino
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // sTetromino
    [0, 1, displayWidth + 1, displayWidth * 2 + 1] // lTetromino
  ]
  // Display the shape in the mini-grid
  function displayShape() {
    // Remove any Tetromino from the entire grid
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
      square.style.backgroundColor = ''
    })
    // Display next Tetromino
    upNextTetromino[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add('tetromino')
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
  }

  // Adding functionality to start/pause button
  startButton.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
      status.innerHTML = 'Pause'
      document.removeEventListener('keyup', control)
    } else {
      status.innerHTML = `Level ${currentLevel}`
      document.addEventListener('keyup', control)
      draw()
      level.forEach((item, i) => {

      });
      timerId = setInterval(moveDown, speed[currentLevel - 1])
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      displayShape()
    }
  })

  // Add score
  function addScore() {
    for (let i = 0; i < 287; i += width) {
      const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9, i + 10, i + 11]
      if (row.every(index => squares[index].classList.contains('taken'))) {
        score += 12
        scoreDisplay.innerHTML = ` ${score}`
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
          squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
    if (score >= 120) {
      currentLevel = level[1]
      status.innerHTML = `Level ${currentLevel}`
      clearInterval(timerId)
      timerId = setInterval(moveDown, speed[currentLevel - 1])
    }
    if (score >= 240) {
      currentLevel = level[2]
      status.innerHTML = `Level ${currentLevel}`
      clearInterval(timerId)
      timerId = setInterval(moveDown, speed[currentLevel - 1])
    }
    if (score >= 480) {
      currentLevel = level[3]
      status.innerHTML = `Level ${currentLevel}`
      clearInterval(timerId)
      timerId = setInterval(moveDown, speed[currentLevel - 1])
    }
    if (score >= 960) {
      currentLevel = level[4]
      status.innerHTML = `Level ${currentLevel}`
      clearInterval(timerId)
      timerId = setInterval(moveDown, speed[currentLevel - 1])
    }
    if (score >= 1920) {
      currentLevel = level[5]
      status.innerHTML = `Level ${currentLevel}`
      clearInterval(timerId)
      timerId = setInterval(moveDown, speed[currentLevel - 1])
    }
    if (score >= 3840) {
      currentLevel = level[6]
      status.innerHTML = `Level ${currentLevel}`
      clearInterval(timerId)
      timerId = setInterval(moveDown, speed[currentLevel - 1])
    }
    if (score >= 7680) {
      currentLevel = level[7]
      status.innerHTML = `Level ${currentLevel}`
      clearInterval(timerId)
      timerId = setInterval(moveDown, speed[currentLevel - 1])
    }
    if (score >= 15360) {
      currentLevel = level[8]
      status.innerHTML = `Level ${currentLevel}`
      clearInterval(timerId)
      timerId = setInterval(moveDown, speed[currentLevel - 1])
    }
    if (score >= 30720) {
      currentLevel = level[9]
      status.innerHTML = `Level ${currentLevel}`
      clearInterval(timerId)
      timerId = setInterval(moveDown, speed[currentLevel - 1])
    }
  }

  // Game over
  function gameOver() {
    if (currentTetromino.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      status.innerHTML = 'Game Over'
      clearInterval(timerId)
    }
  }

  // Restart start
  clearButton.addEventListener('click', clear)
  function clear() {
    clearInterval(timerId)
    status.innerHTML = 'Cleared'
    document.removeEventListener('keyup', control)
    document.location.href = ''
  }
})
