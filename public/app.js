const myP5 = new p5(sk => {
  // INITIAL APPROACH
  const socket = io()
  const gwidth = 640
  const gheight = 480
  const game = {
    id: false,
    me: false,
    opponent: false,
    won: false,
    lost: false,
    startTime: false,
    started: false,
    plOne: {
      hg: 16,
      wd: 80,
      x: gwidth / 2,
      y: gheight - 16,
      health: 9,
      scX: 60,
      scY: gheight - 60 - 34
    },
    plTwo: {
      hg: 16,
      wd: 80,
      x: gwidth / 2,
      y: 0,
      health: 9,
      scX: 60,
      scY: 60
    },
    ball: {
      diameter: 30,
      x: 50,
      y: 50,
      xc: 12,
      yc: 12
    }
  }
  let font, bg

  sk.preload = function () {
    font = sk.loadFont('/public/neuropol-x-rg.ttf')
    bg = sk.loadImage('/public/cityscape.jpg')
  }

  sk.setup = () => {
    sk.createCanvas(gwidth, gheight)
    // sk.frameRate(60)
    sk.textFont(font)
    sk.noLoop()
  }

  sk.draw = () => {
    sk.background(bg)
    sk.textAlign(sk.CENTER, sk.CENTER)

    if (!game.id) {
      sk.fill(255, 70, 255)
      sk.textSize(38)
      sk.text('ping-pong', 0, 100, sk.width)
      sk.textSize(34)
      sk.text('create a new game', 0, 180, sk.width)
      sk.text('or join an existing game', 0, 220, sk.width)
    } else if (!game.opponent) {
      sk.fill(255, 0, 180)
      sk.textSize(38)
      sk.text('ping-pong', 0, 100, sk.width)
      sk.textSize(34)
      sk.text(`the game id is ${game.id}`, 0, 180, sk.width)
      sk.text('waiting for player to join...', 0, 220, sk.width)
    } else if (!game.started) {
      sk.fill(255, 0, 180)
      sk.textSize(38)
      sk.text('ping-pong', 0, 100, sk.width)
      sk.textSize(34)
      sk.text('player joined', 0, 180, sk.width)
      const startingIn = parseInt((game.startTime - Date.now()) / 1000)
      sk.text(`game starts in ${startingIn} seconds...`, 0, 220, sk.width)

      if (startingIn <= 0) {
        game.started = true
        sk.frameRate(26)
      }
    } else {
      sk.fill(200, 0, 100)
      sk.noStroke()
      sk.ellipse(game.ball.x, game.ball.y, game.ball.diameter, game.ball.diameter)

      // move the ball
      game.ball.x += game.ball.xc
      game.ball.y += game.ball.yc

      if (game.ball.x < game.ball.diameter / 2 ||
        game.ball.x > gwidth - 0.5 * game.ball.diameter) {
        game.ball.xc *= -1
      }
      if (game.ball.y < (game.ball.diameter / 2) ||
         game.ball.y > gheight - 0.5 * game.ball.diameter) {
        game.ball.yc *= -1
      }

      sk.textSize(38)
      // my paddle
      sk.fill(160, 0, 160)
      sk.rect(0, game.me.y, gwidth, game.me.hg)
      sk.fill(255, 0, 255)
      sk.rect(game.me.x, game.me.y, game.me.wd, game.me.hg)
      sk.text(`${game.me.health}`, game.me.scX, game.me.scY)
      // opponent paddle
      sk.fill(200, 255, 255)
      sk.rect(0, game.opponent.y, gwidth, game.opponent.hg)
      sk.fill(0, 200, 200)
      sk.rect(game.opponent.x, game.opponent.y, game.opponent.wd, game.opponent.hg)
      sk.text(`${game.opponent.health}`, game.opponent.scX, game.opponent.scY)

      // check the scores
      if (game.me.health <= 0) {
        socket.emit('lost', 0)
        game.lost = true
      }

      // my paddle control
      if (sk.keyIsDown(sk.LEFT_ARROW)) {
        game.me.x -= 15
        socket.emit('xUpdate', game.me.x)
      }

      if (sk.keyIsDown(sk.RIGHT_ARROW)) {
        game.me.x += 15
        socket.emit('xUpdate', game.me.x)
      }

      // my collision
      if (game.me.y === 0) {
        if (game.ball.y - (game.ball.diameter / 2) <= 16) {
          game.ball.yc *= -1
          socket.emit('ballUpdate', `${game.ball.xc} ${game.ball.yc} ${game.ball.x} ${game.ball.y}`)

          // paddle missed, emit score
          if (game.ball.x < game.me.x ||
              game.ball.x > game.me.x + game.me.wd) {
            game.me.health--
            socket.emit('health', game.me.health)
          }
        }
      } else {
        if (game.ball.y + (game.ball.diameter / 2) >= game.me.y) {
          game.ball.yc *= -1
          socket.emit('ballUpdate', `${game.ball.xc} ${game.ball.yc} ${game.ball.x} ${game.ball.y}`)

          // paddle missed, emit score
          if (game.ball.x < game.me.x ||
              game.ball.x > game.me.x + game.me.wd) {
            game.me.health--
            socket.emit('health', game.me.health)
          }
        }
      }

      if (game.won) {
        sk.fill(255, 0, 180)
        sk.textSize(38)
        sk.text('you won', 0, 100, sk.width)
        sk.noLoop()
      }

      if (game.lost) {
        sk.fill(255, 0, 180)
        sk.textSize(38)
        sk.text('you lost', 0, 100, sk.width)
        sk.noLoop()
      }
    }
  }

  // buttons
  const newGame = document.getElementById('new-game')
  const enterGame = document.getElementById('enter-game')

  // create a new game
  newGame.onclick = () => {
    // create a new game
    newGame.disabled = true
    newGame.style.textDecoration = 'line-through'
    newGame.style.color = 'rgba(255, 0, 255, 0.4)'
    enterGame.disabled = true
    enterGame.style.textDecoration = 'line-through'
    enterGame.style.color = 'rgba(255, 0, 255, 0.4)'
    socket.emit('newGame', 0)
  }
  socket.on('newGame', id => {
    game.id = id
    sk.redraw()
  })
  socket.on('playerJoined', pt => {
    // player joined, start game in s seconds
    game.startTime = parseInt(pt.split(' ')[1])
    game.me = game.plOne
    game.opponent = game.plTwo
    sk.frameRate(2)
    sk.loop()
  })

  // enter a game
  enterGame.onclick = () => {
    // enter a game
    const id = document.getElementById('game-id').value
    socket.emit('enterGame', id)
    enterGame.disabled = true
    enterGame.style.textDecoration = 'line-through'
    enterGame.style.color = 'rgba(255, 0, 255, 0.4)'
    newGame.disabled = true
    newGame.style.textDecoration = 'line-through'
    newGame.style.color = 'rgba(255, 0, 255, 0.4)'
  }
  // invalid game id
  socket.on('invalidGame', _ => {
    console.log('invalid game id')
    enterGame.disabled = false
    enterGame.style.textDecoration = 'none'
    enterGame.style.color = 'rgb(255, 0, 255)'
    newGame.disabled = false
    newGame.style.textDecoration = 'none'
    newGame.style.color = 'rgb(255, 0, 255)'
  })
  socket.on('gameJoined', idTm => {
    // game joined, start game in s seconds
    const [id, tm] = idTm.split(' ')
    game.startTime = parseInt(tm)
    game.me = game.plTwo
    game.opponent = game.plOne
    game.id = id
    sk.frameRate(2)
    sk.loop()
  })

  // socket on opponent xUpdate
  socket.on('xUpdate', x => (game.opponent.x = parseInt(x)))

  // socket on ball update
  socket.on('ballUpdate', ch => {
    [game.ball.xc, game.ball.yc, game.ball.x, game.ball.y] = ch.split(' ').map(v => parseInt(v))
  })

  // socket on score
  socket.on('health', h => {
    game.opponent.health = parseInt(h)
  })

  // socket on lost
  socket.on('lost', _ => {
    game.won = true
  })
})
