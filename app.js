document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const width = 12
  const score = document.querySelector('#score')
  const startButton = document.querySelector('#start-pause')

  // The tetrominoes and their rotations
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

  //all tetrominoes together
  const theTetrominoes = [lTetromino, zTetromino, iTetromino, tTetromino, sTetromino, oTetromino]

  let currentPosition = 4
  let current = theTetrominoes[0][0]

  console.log(current)

  //draw the first rotation of the first tetromino
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino')
    })
  }

  draw()

})
