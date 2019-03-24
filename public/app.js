const socket = io()
const gwidth = 600
const gheight = 700
let started = false
let paddleWidth = 100
let paddleHeight = 16
let whichP = '0'
let isloop = true
let p1update = 0
let p2update = 0

const diameter = 50
let xBall = Math.floor(Math.random() * 300) + 50
let yBall = 50
let xBallChange = 10
let yBallChange = 10

const p1 = {}
const p2 = {}

function setup () {
  createCanvas(gwidth, gheight)
  frameRate(30)
  textSize(25)
}

function draw () {
  background(44)
  if (!started) {
    p1.xPaddle = gwidth / 2
    p1.yPaddle = gheight - 16
    p2.xPaddle = gwidth / 2
    p2.yPaddle = 16
    started = true
  }

  noStroke()
  // text(`Ball-x: ${xBall}`, 40, 80)
  // text(`Ball-y: ${yBall}`, 40, 110)
  // text(`Play-1: ${p1.xPaddle}`, 40, 140)
  // text(`Play-2: ${p2.xPaddle}`, 40, 170)
  // text(`Play-1: ${p1update}`, 40, 210)
  // text(`Play-2: ${p2update}`, 40, 240)
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

    if (collideRectCircle(p1.xPaddle, p1.yPaddle, paddleWidth, paddleHeight, xBall, yBall, diameter)) {
      // xBallChange *= -1
      yBallChange *= -1
      socket.emit('updateBall', `${xBall} ${yBall}`)
      p1update++
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

    if (collideRectCircle(p2.xPaddle, p2.yPaddle, paddleWidth, paddleHeight, xBall, yBall, diameter)) {
      // xBallChange *= -1
      yBallChange *= -1
      socket.emit('updateBall', `${xBall} ${yBall}`)
      p2update++
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

function keyPressed () {
  if (keyCode === 32) isloop = !isloop
  isloop ? loop() : noLoop()
}

socket.on('whichP', (p) => {
  whichP = p
  if (p === '1') {
    socket.on('P2', x => (p2.xPaddle = parseInt(x)))
    socket.on('P2YBall', y => (yBallChange = parseInt(y)))
    socket.on('P2XBall', x => (xBallChange = parseInt(x)))
    socket.on('P2Ball', b => {
      xBall = parseInt(b.split(' ')[0])
      yBall = parseInt(b.split(' ')[1])
    })
  } else if (p === '2') {
    socket.on('P1', x => (p1.xPaddle = parseInt(x)))
    socket.on('P1YBall', y => (yBallChange = parseInt(y)))
    socket.on('P1XBall', x => (xBallChange = parseInt(x)))
    socket.on('P1Ball', b => {
      xBall = parseInt(b.split(' ')[0])
      yBall = parseInt(b.split(' ')[1])
    })
  } else {
    socket.on('P2', x => (p2.xPaddle = parseInt(x)))
    socket.on('P1', x => (p1.xPaddle = parseInt(x)))
    socket.on('P1YBall', y => (yBallChange = parseInt(y)))
    socket.on('P1XBall', x => (xBallChange = parseInt(x)))
    socket.on('P2YBall', y => (yBallChange = parseInt(y)))
    socket.on('P2XBall', x => (xBallChange = parseInt(x)))
    socket.on('P2Ball', b => {
      xBall = parseInt(b.split(' ')[0])
      yBall = parseInt(b.split(' ')[1])
    })
    socket.on('P1Ball', b => {
      xBall = parseInt(b.split(' ')[0])
      yBall = parseInt(b.split(' ')[1])
    })
  }
})
