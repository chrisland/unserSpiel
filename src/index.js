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

/* Bullets */
var bullets = {};

/* Collidables */
var collidables = {
  ground: {},
  platforms: {},
  stars: {},
};

/* Backgrounds */
var backgrounds = {};

/* Cursors */
var cursors = {};

/* Controls */
var controls = {
  playerChange: {},
  fire: {}
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

    this.setupCollissions(scene);
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
  },

  // make player collidable with..
  setupCollissions: function (scene) {
    var self = this;
    var activePlayer = this.getActive();

    // ..ground
    scene.physics.add.collider(activePlayer.physics, collidables.ground);

    // ..platforms
    scene.physics.add.collider(activePlayer.physics, collidables.platforms, function (player, platform) {
      moveable = false;
    });

    // activePlayer.physics.touching.left??
    for (var platform of collidables.platforms.getChildren()) {
      console.log(platform);
      platform.on('collide', function () {
        console.log('iiyooo');
      });
    }

    // ..stars
    scene.physics.add.collider(activePlayer.physics, collidables.stars, function (player, star) {
      star.destroy();
    });
  }
};


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

  this.load.image('star', 'assets/stern.png');

  this.load.image('bullet_1', 'assets/dude.png');
  this.load.image('bullet_2', 'assets/dude_2.png');

}

/**
 * Create function
 */
function create() {
  var self = this;

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
  collidables.ground = ground;

  // platforms
  collidables.platforms = this.add.group();

  // platform1
  var platform1 = this.physics.add.sprite(700, 450, 'ground');
  platform1.body.immovable = true;
  platform1.body.allowGravity = false;
  collidables.platforms.add(platform1);

  // stars
  collidables.stars = this.add.group();

  var star = this.physics.add.sprite(400, 300, 'star');
  star.body.immovable = true;
  star.body.allowGravity = false;
  collidables.stars.add(star);

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
  * Bullets
  */
  

  bullets = this.add.group({
    classType: Bullet,
    maxSize: 30,
    runChildUpdate: true
  });

  /*
   * Input Events - Eingaben
   */

  cursors = this.input.keyboard.createCursorKeys();
  controls.playerChange = this.input.keyboard.addKey('C');

  controls.fire = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  /*
   * HUD
   */

  /*
  hud.playerChanges = this.add.text(16, 16, 'playerChanges: 0', {
    fontSize: '32px',
    fill: '#FFFFFF',
  });
  */
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
    collidables.ground.tilePositionX -= 10;

    collidables.platforms.getChildren().forEach(function (platform) {
      platform.setVelocityX(280);
    });
  }

  // nach rechts
  else if (moveable && cursors.right.isDown) {
    dude.moveRight();

    backgrounds[1].tilePositionX += 10;
    backgrounds[2].tilePositionX += 7;
    backgrounds[3].tilePositionX += 2;
    backgrounds[4].tilePositionX += 5;
    collidables.ground.tilePositionX += 10;

    collidables.platforms.getChildren().forEach(function (platform) {
      platform.setVelocityX(-280);
    });
  }

  // Richtung umdrehen
  else {
    dude.moveTurn();
    collidables.platforms.getChildren().forEach(function (platform) {
      platform.setVelocityX(0);
    });
  }
  moveable = true;

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

  if (Phaser.Input.Keyboard.JustDown(controls.fire)) {

      var bullet = bullets.get();

      if (bullet) {
        let dude_bounds = dude.getBounds();
        bullet.fire(dude_bounds.x, dude_bounds.y);
      }
  }

}
