document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const width = 12
  const score = document.querySelector('#score')
  const startButton = document.querySelector('#start-pause')

  // The Tetrominoes and their rotations
  const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]

  const iTetromino = [
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1]
  ]

  const oTetromino = [
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1]
  ]

  const tTetromino = [
    [1, width, width+1, width+2],
    [1, width+1,width+2, width*2+1],
    [width, width+1, width+2, width*2+1],
    [1, width, width+1, width*2+1]
  ]

  const zTetromino = [
    [1, width, width+1, width*2],
    [width, width+1, width*2+1, width*2+2],
    [1, width, width+1, width*2],
    [width, width+1, width*2+1, width*2+2]
  ]

  const sTetromino = [
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1],
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1]
  ]

  // All Tetrominoes together
  const theTetrominoes = [lTetromino, zTetromino, iTetromino, tTetromino, sTetromino, oTetromino]

  let currentPosition = 4
  let currentRotation = 0

  // Randomly select a Tetromino and its first rotations
  let randomTetromino = Math.floor(Math.random()*theTetrominoes.length)
  let currentTetromino = theTetrominoes[randomTetromino][currentRotation]

  // Draw the random Tetromino
  function draw() {
    currentTetromino.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino')
    })
  }
  // Undraw the tetromino
  function undraw() {
    currentTetromino.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino')
    })
  }

  // Make the Tetrominoes move down every second
  timerId = setInterval(moveDown, 1000)

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
      randomTetromino = Math.floor(Math.random()*theTetrominoes.length)
      currentPosition = 4
      currentTetromino = theTetrominoes[randomTetromino][currentRotation]
      draw()
    }
  }

})
