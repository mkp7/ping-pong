const socket = io()
let started = false
let paddleWidth = 100
let paddleHeight = 16

const p1 = {}
const p2 = {}

function setup () {
  createCanvas(640, 480)
}

function draw () {
  background(44)
  if (!started) {
    p1.xPaddle = 640 / 2
    p1.yPaddle = 480 - 50
    p2.xPaddle = 640 / 2
    p2.yPaddle = 50
    started = true
  }

  fill(0, 255, 255)
  noStroke()
  rect(p1.xPaddle, p1.yPaddle, paddleWidth, paddleHeight)
  rect(p2.xPaddle, p2.yPaddle, paddleWidth, paddleHeight)
}

function keyPressed () {
  if (keyCode === LEFT_ARROW) {
    // p1.xPaddle -= 30;
    socket.emit('keyPressed', 'P1LEFT')
  }

  if (keyCode === RIGHT_ARROW) {
    // p1.xPaddle += 30;
    socket.emit('keyPressed', 'P1RIGHT')
  }

  if (keyCode === 65) {
    // p2.xPaddle -= 30;
    socket.emit('keyPressed', 'P2LEFT')
  }

  if (keyCode === 68) {
    // p2.xPaddle += 30;
    socket.emit('keyPressed', 'P2RIGHT')
  }
}

socket.on('P1', (x) => {
  p1.xPaddle = x
  console.log(x)
})
socket.on('P2', (x) => {
  p2.xPaddle = x
  console.log(x)
})
