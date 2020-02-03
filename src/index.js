var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: true
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);

function preload() {
  this.load.image("bg1", "assets/level_1/level_1.png");
  this.load.image("bg2", "assets/level_1/level_2.png");
  this.load.image("bg3", "assets/level_1/level_3.png");
  this.load.image("bg4", "assets/level_1/level_4.png");
  this.load.image("sky", "assets/level_1/sky.png");

  this.load.image('ground', 'examples/DinoDash/assets/background/platform.png');

  this.load.spritesheet("player_1", "assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48
  });
  this.load.spritesheet("player_2", "assets/dude_2.png", {
    frameWidth: 32,
    frameHeight: 48
  });
}

/*
 * Global Variables
 */

/* Players */
var players = {};

/* Platforms */
var platforms = {};

/* Backgrounds */
var backgrounds = {};

/* Cursors */
var cursors = {};

/* Controls */
var controls = {
  playerChange: {},
};

/* HUD */
var hud = {};

/* gameOver? */
var gameOver = false;

/* moveable? */
var moveable = true;

/**
 * Create function
 */
function create() {
  /*
   * Hintergrund
   */

  backgrounds = {
    sky: this.add.image(400, 300, 'sky'),
    1: this.add.tileSprite(2500, 300, 5000, 600, 'bg1'),
    2: this.add.tileSprite(2500, 300, 5000, 600, 'bg2'),
    3: this.add.tileSprite(2500, 300, 5000, 600, 'bg3'),
    4: this.add.tileSprite(2500, 300, 5000, 600, 'bg4'),
  };

  /*
   * Platform
   */

  // ground
  var ground = this.add.tileSprite(400, 568, 800, 100, 'ground');
  this.physics.add.existing(ground);
  ground.body.immovable = true;
  ground.body.moves = false;
  platforms.ground = ground;

  // platform1
  var platform1 = this.physics.add.sprite(700, 450, 'ground');
  platform1.body.immovable = true;
  platform1.body.allowGravity = false;
  platforms.platform1 = platform1;

  /*
   * Player - Spielfigur
   */

  // Player 1
  players.children[0] = new Player('player_1', this);

  // Player 2
  players.children[1] = new Player('player_2', this);

  // Set Player
  players.setActive(0, this);

  /*
   * Input Events - Eingaben
   */

  cursors = this.input.keyboard.createCursorKeys();
  controls.playerChange = this.input.keyboard.addKey('C');

  /*
   * HUD
   */

  hud.playerChanges = this.add.text(16, 16, 'playerChanges: 0', {
    fontSize: '32px',
    fill: '#FFFFFF',
  });
}

/**
 * Update function
 */
function update() {
  /*
   * Spiel Ende ?
   */
  if (gameOver) {
    return;
  }

  var player = players.getActive();

  // nach links
  if (moveable && cursors.left.isDown) {
    player.moveLeft();

    backgrounds[1].tilePositionX -= 10;
    backgrounds[2].tilePositionX -= 7;
    backgrounds[3].tilePositionX -= 2;
    backgrounds[4].tilePositionX -= 5;
    platforms.ground.tilePositionX -= 10;

    platforms.platform1.setVelocityX(280);
  }

  // nach rechts
  else if (moveable && cursors.right.isDown) {
    player.moveRight();

    backgrounds[1].tilePositionX += 10;
    backgrounds[2].tilePositionX += 7;
    backgrounds[3].tilePositionX += 2;
    backgrounds[4].tilePositionX += 5;
    platforms.ground.tilePositionX += 10;

    platforms.platform1.setVelocityX(-280);
  }

  // Richtung umdrehen
  else {
    player.moveTurn();
    platforms.platform1.setVelocityX(0);
  }

  if (cursors.up.isDown) {
    // Springen
    if (player.physics.body.touching.down) {
      player.jump();
    }

    // Fliegen
    else {
      if (cursors.up.getDuration() < 500) {
        player.fly();
      }
    }
  }

  if (Phaser.Input.Keyboard.JustDown(controls.playerChange)) {
    players.toggle(this);
  }
}
