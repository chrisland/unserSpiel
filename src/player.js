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
