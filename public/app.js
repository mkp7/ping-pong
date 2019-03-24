const socket = io()
const gwidth = 300
const gheight = 300
let started = false
let paddleWidth = 100
let paddleHeight = 16
let whichP = '0'

const diameter = 50
let xBall = Math.floor(Math.random() * 300) + 50
let yBall = 50
let xBallChange = 5
let yBallChange = 5

const p1 = {}
const p2 = {}

function setup () {
  createCanvas(gwidth, gheight)
}

function draw () {
  background(44)
  if (!started) {
    p1.xPaddle = gwidth / 2
    p1.yPaddle = gheight - 50
    p2.xPaddle = gwidth / 2
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

    if ((xBall > p1.xPaddle &&
      xBall < p1.xPaddle + paddleWidth) &&
      (yBall + (diameter / 2) >= p1.yPaddle)) {
      xBallChange *= -1
      yBallChange *= -1
      socket.emit('updateYBall', `${yBallChange}`)
      socket.emit('updateXBall', `${xBallChange}`)
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

    if ((xBall > p2.xPaddle &&
      xBall < p2.xPaddle + paddleWidth) &&
      (yBall + (diameter / 2) >= p2.yPaddle)) {
      xBallChange *= -1
      yBallChange *= -1
      socket.emit('updateYBall', `${yBallChange}`)
      socket.emit('updateXBall', `${xBallChange}`)
    }
  } else {
    fill(0, 255, 255)
    rect(p2.xPaddle, p2.yPaddle, paddleWidth, paddleHeight)
    rect(p1.xPaddle, p1.yPaddle, paddleWidth, paddleHeight)
  }

  fill(200, 0, 100)
  noStroke()
  ellipse(xBall, yBall, diameter, diameter)
  xBall += xBallChange
  yBall += yBallChange
  if (xBall < diameter / 2 ||
    xBall > gwidth - 0.5 * diameter) {
    xBallChange *= -1
  }
  if (yBall < (diameter / 2) ||
     yBall > gheight - 0.5 * diameter) {
    yBallChange *= -1
  }

  // const xColl = (xBall > p1.xPaddle && xBall < p1.xPaddle + paddleWidth)
}

socket.on('whichP', (p) => {
  whichP = p
  if (p === '1') {
    socket.on('P2', x => (p2.xPaddle = x))
    socket.on('P2YBall', y => (yBallChange = y))
    socket.on('P2XBall', x => (xBallChange = x))
  } else if (p === '2') {
    socket.on('P1', x => (p1.xPaddle = x))
    socket.on('P1YBall', y => (yBallChange = y))
    socket.on('P1XBall', x => (xBallChange = x))
  } else {
    socket.on('P2', x => (p2.xPaddle = x))
    socket.on('P1', x => (p1.xPaddle = x))
    socket.on('P1YBall', y => (yBallChange = y))
    socket.on('P1XBall', x => (xBallChange = x))
    socket.on('P2YBall', y => (yBallChange = y))
    socket.on('P2XBall', x => (xBallChange = x))
  }
})
