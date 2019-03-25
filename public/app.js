let getUserName, startGame, joinGame, watchGame

const myP5 = new p5(function (s) {
  // const socket = io()

  // initialize player state
  const Player = {
    username: null
  }

  // create game
  // peer joins the game created
  // game starts / game ends
  // user exits the game, game score

  const gwidth = 640
  const gheight = 480
  let font

  s.preload = function () {
    // Ensure the .ttf or .otf font stored in the assets directory
    // is loaded before setup() and draw() are called
    font = s.loadFont('/public/gomarice_game_music_love.ttf')
  }

  s.setup = function () {
    s.createCanvas(gwidth, gheight)
    s.frameRate(30)
    s.textFont(font)
  }

  s.draw = function () {
    s.background(33)

    if (Player.username === null) {
      // username (or game selection?) frame
      s.fill(255, 0, 255)
      s.textAlign(s.CENTER, s.CENTER)
      s.textSize(34)
      s.text('choose a username', 0, 100, s.width)
      s.noLoop()
    } else { // username selected - create a game (or join a game?)
      s.fill(255, 70, 255)
      s.textAlign(s.CENTER, s.CENTER)
      s.textSize(34)
      s.text(`welcome, ${Player.username}`, 0, 100, s.width)
      s.textSize(28)
      s.text('create a new game', 0, 180, s.width)
      s.text('or join an existing game', 0, 220, s.width)
      s.noLoop()
    }
  }

  // console.log(document.getElementById('signup'))
  const submit = document.getElementById('signup')
  submit.onclick = () => {
    submit.disabled = true

    submit.disabled = false
    Player.username = document.getElementById('username').value
    s.redraw()
  }
})
