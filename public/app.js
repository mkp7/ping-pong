const socket = io()
let started = false
let paddleWidth = 100
let paddleHeight = 16
let whichP = '0'

const p1 = {}
const p2 = {}

function setup () {
  createCanvas(360, 360)
}

function draw () {
  background(44)
  if (!started) {
    p1.xPaddle = 360 / 2
    p1.yPaddle = 360 - 50
    p2.xPaddle = 360 / 2
    p2.yPaddle = 50
    started = true
  }

  noStroke()
  if (whichP === '1') {
    fill(255, 0, 255)
    rect(p1.xPaddle, p1.yPaddle, paddleWidth, paddleHeight)
    fill(0, 255, 255)
    rect(p2.xPaddle, p2.yPaddle, paddleWidth, paddleHeight)

    if (keyIsDown(LEFT_ARROW)) {
      p1.xPaddle -= 15
      socket.emit('updateX', `${p1.xPaddle}`)
    }

    if (keyIsDown(RIGHT_ARROW)) {
      p1.xPaddle += 15
      socket.emit('updateX', `${p1.xPaddle}`)
    }
  } else if (whichP === '2') {
    fill(255, 0, 255)
    rect(p2.xPaddle, p2.yPaddle, paddleWidth, paddleHeight)
    fill(0, 255, 255)
    rect(p1.xPaddle, p1.yPaddle, paddleWidth, paddleHeight)

    if (keyIsDown(LEFT_ARROW)) {
      p2.xPaddle -= 15
      socket.emit('updateX', `${p2.xPaddle}`)
    }

    if (keyIsDown(RIGHT_ARROW)) {
      p2.xPaddle += 15
      socket.emit('updateX', `${p2.xPaddle}`)
    }
  } else {
    fill(0, 255, 255)
    rect(p2.xPaddle, p2.yPaddle, paddleWidth, paddleHeight)
    rect(p1.xPaddle, p1.yPaddle, paddleWidth, paddleHeight)
  }
}

socket.on('whichP', (p) => {
  whichP = p
  if (p === '1') {
    socket.on('P2', x => (p2.xPaddle = x))
  } else if (p === '2') {
    socket.on('P1', x => (p1.xPaddle = x))
  } else {
    socket.on('P2', x => (p2.xPaddle = x))
    socket.on('P1', x => (p1.xPaddle = x))
  }
})
