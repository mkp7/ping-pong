const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

app.use('/public', express.static('public'))

app.get('/', function (req, res) {
  res.sendFile(`${__dirname}/public/index.html`)
})

const game = {
  p1X: 640 / 2,
  p2X: 640 / 2
}

let id = 0
let conn = []

io.on('connection', function (socket) {
  socket.id = id
  id++
  conn[id] = socket
  console.log('a user connected')

  socket.on('disconnect', function () {
    conn[socket.id] = null
    console.log('user disconnected')
  })

  socket.on('keyPressed', function (action) {
    if (action === 'P1LEFT') {
      game.p1X -= 20
      conn.forEach(s => {
        if (s !== null) {
          s.emit('P1', game.p1X)
        }
      })
    }

    if (action === 'P1RIGHT') {
      game.p1X += 20
      conn.forEach(s => {
        if (s !== null) {
          s.emit('P1', game.p1X)
        }
      })
    }

    if (action === 'P2LEFT') {
      game.p2X -= 20
      conn.forEach(s => {
        if (s !== null) {
          s.emit('P2', game.p1X)
        }
      })
    }

    if (action === 'P2RIGHT') {
      game.p2X += 20
      conn.forEach(s => {
        if (s !== null) {
          s.emit('P2', game.p1X)
        }
      })
    }

    console.log(game)
  })
})

http.listen(3000, function () {
  console.log('listening on *:3000')
})
