import GameScene from "./game.js";
import TitleScene from "./title.js";

let config = {
  type: Phaser.WEBGL,
  width: 800,
  height: 600,
  parent: "canvas",
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 1000
      },
      debug: false
    }
  },
  scene: [TitleScene, GameScene]
};

let game = new Phaser.Game(config);
