/*
stars and bombs:
https://github.com/mshin1995/DinoDash/blob/master/src/game.js


nice Bullet:
http://labs.phaser.io/edit.html?src=src/input/keyboard/just%20down.js
*/

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

  this.load.image("ground", "assets/background/platform.png");

  this.load.spritesheet("player_1", "assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48
  });
  this.load.spritesheet("player_2", "assets/dude_2.png", {
    frameWidth: 32,
    frameHeight: 48
  });
}

var platforms;

//var player;

var players = {
  active: false,
  count: 0,
  childs: [],
  getActive: function() {
    if (this.active !== false && this.childs[this.active]) {
      return this.childs[this.active];
    }
    return false;
  },
  setActive: function(key, scene) {
    this.active = key;
    players.getActive().visible = true;
    scene.physics.add.collider(players.getActive(), scene.ground);
    scene.physics.add.collider(players.getActive(), platforms);
  },
  toggle: function(scene) {
    var temp = players.getActive();
    temp.setVelocity(0, 0);
    temp.visible = false;

    var next = this.active + 1;
    if (next >= this.childs.length) {
      next = 0;
    }
    this.setActive(next, scene);

    players.getActive().setVelocity(0, 0);
    players.getActive().x = temp.x;
    players.getActive().y = temp.y;

    count++;
  }
};
var cursors;
var keyPlayerChange;

var gameOver;

function create() {
  /*
   * Hintergrund
   */
  this.add.image(400, 300, "sky");

  this.background3 = this.add.tileSprite(2500, 300, 5000, 600, "bg3");
  this.background4 = this.add.tileSprite(2500, 300, 5000, 600, "bg4");
  this.background2 = this.add.tileSprite(2500, 300, 5000, 600, "bg2");
  this.background1 = this.add.tileSprite(2500, 300, 5000, 600, "bg1");

  /*
   * PLATFORM
   */

  platforms = this.physics.add.staticGroup();
  /*
  platforms
    .create(400, 568, "ground")
    .setScale(2)
    .refreshBody();
    */

  //platforms.create(600, 400, "ground");
  //platforms.create(50, 250, "ground");

  //platforms.create(750, 220, "ground");
  //platforms.create(700, 520, "ground");

  this.ground = this.add.tileSprite(400, 568, 800, 100, "ground");
  this.physics.add.existing(this.ground);
  this.ground.body.immovable = true;
  this.ground.body.moves = false;

  /*
   * Player - Spielfigur
   */
  // PLAYER 1
  players.childs[0] = this.physics.add.sprite(100, 450, "player_1");
  players.childs[0]._name = "player_1";
  players.childs[0].setBounce(0.2);
  players.childs[0].setCollideWorldBounds(true);
  players.childs[0].visible = false;

  // Set Player
  players.setActive(0, this);

  this.anims.create({
    key: "player_1_left",
    frames: this.anims.generateFrameNumbers("player_1", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: "player_1_turn",
    frames: [{ key: "player_1", frame: 4 }],
    frameRate: 20
  });

  this.anims.create({
    key: "player_1_right",
    frames: this.anims.generateFrameNumbers("player_1", { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });

  // Player 2
  players.childs[1] = this.physics.add.sprite(100, 450, "player_2");
  players.childs[1]._name = "player_2";
  players.childs[1].setBounce(0.2);
  players.childs[1].setCollideWorldBounds(true);
  players.childs[1].visible = false;

  this.anims.create({
    key: "player_2_left",
    frames: this.anims.generateFrameNumbers("player_2", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: "player_2_turn",
    frames: [{ key: "player_2", frame: 4 }],
    frameRate: 20
  });

  this.anims.create({
    key: "player_2_right",
    frames: this.anims.generateFrameNumbers("player_2", { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });

  /*
   * Input Events - Eingaben
   */
  cursors = this.input.keyboard.createCursorKeys();
  keyPlayerChange = this.input.keyboard.addKey("C");
  /*
   * Physics
   */
  //this.physics.add.collider(players.childs[0], this.ground);
  //### this.physics.add.collider(players.getActive(), this.ground);
  //this.physics.add.collider(player, platforms);

  //platforms = this.add.tileSprite(700, 520, 300, 200, "ground");
  platforms = this.physics.add.sprite(700, 450, "ground");
  //this.physics.add.collider(player, platforms);

  platforms.body.immovable = true;
  platforms.body.allowGravity = false;
  //console.log(platforms.body);
  //this.physics.add.existing(platforms);
  //### this.physics.add.collider(players.getActive(), platforms);

  //this.cameras.main.startFollow(player, true, 0.05, 0.05);

  /*
   * HUD
   */
  this.playerChanges = this.add.text(16, 16, "playerChanges: 0", {
    fontSize: "32px",
    fill: "#FFFFFF"
  });
}

var moveable = true;

function update() {
  /*
   * Spiel Ende ?
   */
  if (gameOver) {
    return;
  }

  var player = players.getActive();
  //console.log(player._name);
  /*
   * Steuerung
   */

  player.setVelocityX(0);
  //platforms.setVelocity(0, 0);

  //console.log(moveable);
  var playerBounds = player.getBounds();

  if (
    moveable &&
    cursors.left.isDown /* Phaser.Input.Keyboard.JustDown(cursors.left)*/
  ) {
    // nach Links
    if (playerBounds.x > 100) {
      player.setVelocityX(-140);
    }
    player.anims.play(player._name + "_left", true);

    this.background1.tilePositionX -= 10;
    this.background2.tilePositionX -= 7;
    this.background3.tilePositionX -= 2;
    this.background4.tilePositionX -= 5;
    this.ground.tilePositionX -= 10;

    //platforms.setVelocityX(1);

    //platforms.incX(7).refresh();
    //platforms.children.entries[1].body.velocity.x = 20;

    platforms.setVelocityX(280);
    //moveable = false;
  } else if (
    moveable &&
    cursors.right.isDown /* Phaser.Input.Keyboard.JustDown(cursors.right)*/
  ) {
    // nach Rechts

    //platforms.incX(-7).refresh();

    //console.log(platforms.children.entries[1].body);

    //platforms.setVelocityX(-140);
    //platforms.x -= 7;

    //platforms.children.entries[1].body.setVelocityX(-140);
    //platforms.children.entries[1].body.position.x = platforms.children.entries[1].body.position.x - 7;

    //platforms.refresh();

    // nicht zu weit links rausschieben lassen
    if (playerBounds.x < 50) {
      player.setVelocityX(140);
      return false;
    }

    // nicht zu weit nach rechts laufen
    if (playerBounds.x < 500) {
      player.setVelocityX(140);
      //console.log(player.speed);
      //player.body.velocity.y = 140;
    }
    player.anims.play(player._name + "_right", true);

    //platforms.body.velocity.y = 140;
    platforms.setVelocityX(-280);

    this.background1.tilePositionX += 10;
    this.background2.tilePositionX += 7;
    this.background3.tilePositionX += 2;
    this.background4.tilePositionX += 5;
    this.ground.tilePositionX += 10;

    //moveable = false;
  } else {
    //moveable = true;
    player.setVelocityX(0);
    player.anims.play(player._name + "_turn");
    platforms.setVelocityX(0);
  }

  if (cursors.up.isDown) {
    if (player.body.touching.down) {
      // Springen
      player.setVelocityY(-330);
      //TODO: animation
    } else {
      // Fliegen
      if (cursors.up.getDuration() < 500) {
        player.setVelocityY(-100);
        //TODO: animation
      }
    }
  }

  if (Phaser.Input.Keyboard.JustDown(keyPlayerChange)) {
    console.log("change player");
    //player.setVelocity(0, 0);
    //player = player_2;
    players.toggle(this);
  }
}
