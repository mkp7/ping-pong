const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

app.use('/public', express.static('public'))

app.get('/', function (req, res) {
  res.sendFile(`${__dirname}/public/index.html`)
})

const players = {
  p1: false,
  p2: false
}

io.on('connection', function (socket) {
  if (players.p2) {
    players.p1 = { socket }
    socket.emit('whichP', '1')
    socket.on('updateX', x => io.emit('P1', x))
    socket.on('updateYBall', y => io.emit('P1YBall', y))
    socket.on('updateXBall', x => io.emit('P1XBall', x))
  } else if (players.p1) {
    players.p2 = { socket }
    socket.emit('whichP', '2')
    socket.on('updateX', x => io.emit('P2', x))
    socket.on('updateYBall', y => io.emit('P2YBall', y))
    socket.on('updateXBall', x => io.emit('P2XBall', x))
  } else socket.emit('whichP', '3')

  console.log('a user connected')
  socket.on('disconnect', function () {
    console.log('user disconnected')
  })
})

http.listen(3000, function () {
  console.log('listening on *:3000')
})
