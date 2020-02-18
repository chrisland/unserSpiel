var Bullet = new Phaser.Class({

  Extends: Phaser.GameObjects.Image,

  initialize:

  function Bullet (scene) {
    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');

    this.speed = Phaser.Math.GetSpeed(600, 1);
  },

  fire: function (x, y) {
    this.setPosition(x, y);

    this.setActive(true);
    this.setVisible(true);
  },

  update: function (time, delta) {
    this.x += this.speed * delta;

    if (this.x > 820)  {
        this.setActive(false);
        this.setVisible(false);
    }
  }

});