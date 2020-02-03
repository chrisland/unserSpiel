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

// players manager
players = {
  active: 0,
  children: [],
  count: 0,

  getActive: function() {
    return this.children[this.active];
  },

  setActive: function(idx, scene) {
    this.active = idx;
    var activePlayer = this.getActive();

    activePlayer.physics.visible = true;

    // make player collidable with platforms
    for (var platform of Object.values(platforms)) {
      scene.physics.add.collider(activePlayer.physics, platform);
    }
  },

  toggle: function(scene) {
    var currentActivePlayer = players.getActive();
    currentActivePlayer.physics.setVelocity(0, 0);
    currentActivePlayer.physics.visible = false;

    var newActivePlayerIdx = this.active + 1;
    if (newActivePlayerIdx >= this.children.length) {
      newActivePlayerIdx = 0;
    }
    this.setActive(newActivePlayerIdx, scene);

    var newActivePlayer = this.getActive();
    newActivePlayer.physics.setVelocity(0, 0);
    newActivePlayer.physics.x = currentActivePlayer.physics.x;
    newActivePlayer.physics.y = currentActivePlayer.physics.y;

    this.count++;
  }
};

function Player(name, scene) {

  /* Initialization */

  this.physics = scene.physics.add.sprite(100, 450, name);
  this.physics.setBounce(0.2);
  this.physics.setCollideWorldBounds(true);
  this.physics.visible = false;

  scene.anims.create({
    key: name + '_left',
    frames: scene.anims.generateFrameNumbers(name, { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: name + '_turn',
    frames: [{ key: name, frame: 4 }],
    frameRate: 20,
  });

  scene.anims.create({
    key: name + '_right',
    frames: scene.anims.generateFrameNumbers(name, { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1,
  });

  var self = this;

  /* Properties */

  this._name = name;
  this.velocity = 140;

  /* Methods */

  this.moveLeft = function () {
    var bounds = self.physics.getBounds();

    if (bounds.x > 100) {
      self.physics.setVelocityX(self.velocity * -1);
    }

    self.physics.anims.play(name + '_left', true);
  }

  this.moveRight = function () {
    var bounds = self.physics.getBounds();

    // nicht zu weit links rausschieben lassen
    if (bounds.x < 50) {
      self.physics.setVelocityX(self.velocity);
      return;
    }

    // nicht zu weit nach rechts laufen
    if (bounds.x < 500) {
      self.physics.setVelocityX(self.velocity);
    }

    self.physics.anims.play(name + '_right', true);
  };

  this.moveTurn = function () {
    self.physics.setVelocityX(0);
    self.physics.anims.play(name + '_turn');
  }

  this.jump = function () {
    self.physics.setVelocityY(-330);
    // TODO: animation
  }

  this.fly = function () {
    self.physics.setVelocityY(-100);
    //TODO: animation
  }

}

/**
 * Preload function
 */
function preload() {
  this.load.image("bg1", "assets/level_1/level_1.png");
  this.load.image("bg2", "assets/level_1/level_2.png");
  this.load.image("bg3", "assets/level_1/level_3.png");
  this.load.image("bg4", "assets/level_1/level_4.png");
  this.load.image("sky", "assets/level_1/sky.png");

  this.load.image('ground', 'assets/platform.png');

  this.load.spritesheet("player_1", "assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48
  });
  this.load.spritesheet("player_2", "assets/dude_2.png", {
    frameWidth: 32,
    frameHeight: 48
  });
}

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

  var dude = players.getActive();

  // nach links
  if (moveable && cursors.left.isDown) {
    dude.moveLeft();

    backgrounds[1].tilePositionX -= 10;
    backgrounds[2].tilePositionX -= 7;
    backgrounds[3].tilePositionX -= 2;
    backgrounds[4].tilePositionX -= 5;
    platforms.ground.tilePositionX -= 10;

    platforms.platform1.setVelocityX(280);
  }

  // nach rechts
  else if (moveable && cursors.right.isDown) {
    dude.moveRight();

    backgrounds[1].tilePositionX += 10;
    backgrounds[2].tilePositionX += 7;
    backgrounds[3].tilePositionX += 2;
    backgrounds[4].tilePositionX += 5;
    platforms.ground.tilePositionX += 10;

    platforms.platform1.setVelocityX(-280);
  }

  // Richtung umdrehen
  else {
    dude.moveTurn();
    platforms.platform1.setVelocityX(0);
  }

  if (cursors.up.isDown) {
    // Springen
    if (dude.physics.body.touching.down) {
      dude.jump();
    }

    // Fliegen
    else {
      if (cursors.up.getDuration() < 500) {
        dude.fly();
      }
    }
  }

  if (Phaser.Input.Keyboard.JustDown(controls.playerChange)) {
    players.toggle(this);
  }
}
