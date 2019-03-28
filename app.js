const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

app.use('/public', express.static('public'))

app.get('/', function (req, res) {
  res.sendFile(`${__dirname}/public/index.html`)
})

const games = {}

function getId (length) {
  const idArr = Array(length)
  const chars = 'abcdefghijklmnopqrstuvwxyz'

  for (let i = 0; i < length; i++) {
    idArr[i] = chars.charAt(Math.floor(Math.random() * chars.length))
  }

  if (games[idArr.join('')] !== undefined) {
    return getId(length)
  }

  return idArr.join('')
}

io.on('connection', function (socket) {
  socket.on('newGame', _ => {
    const id = getId(6)
    games[id] = {
      id: id,
      playerOne: socket
    }
    socket.emit('newGame', id)
  })

  socket.on('enterGame', id => {
    if (games[id] === undefined) {
      socket.emit('invalidGame', 0)
    } else {
      games[id]['playerTwo'] = socket
      const startTime = Date.now() + 4000
      socket.emit('gameJoined', `${id} ${startTime}`)
      games[id]['playerOne'].emit('playerJoined', `${id} ${startTime}`)

      games[id]['playerTwo'].on('xUpdate', x => games[id]['playerOne'].emit('xUpdate', x))
      games[id]['playerOne'].on('xUpdate', x => games[id]['playerTwo'].emit('xUpdate', x))

      games[id]['playerTwo'].on('ballUpdate', yc => games[id]['playerOne'].emit('ballUpdate', yc))
      games[id]['playerOne'].on('ballUpdate', yc => games[id]['playerTwo'].emit('ballUpdate', yc))

      games[id]['playerTwo'].on('lost', _ => games[id]['playerOne'].emit('lost', 0))
      games[id]['playerOne'].on('lost', _ => games[id]['playerTwo'].emit('lost', 0))

      games[id]['playerTwo'].on('health', h => games[id]['playerOne'].emit('health', h))
      games[id]['playerOne'].on('health', h => games[id]['playerTwo'].emit('health', h))
    }
  })

  console.log('a user connected')
  socket.on('disconnect', function () {
    console.log('user disconnected')
  })
})

http.listen(3000, function () {
  console.log('listening on *:3000')
})
