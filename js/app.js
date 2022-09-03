import {
  BIG_BULLET_DIMENSION,
  BULLET_DIMENSION,
  CANVAS_DIMENSION,
  FONT_SIZE,
  GAME_STATE_GAME_OVER,
  GAME_STATE_PLAY,
  GAME_STATE_READY,
  LEVEL_SPEED,
  PLAYER_DIMENSION,
  SCORE,
} from "./constant.js";
import { Player } from "./player.js";
import { Bullet } from "./bullet.js";
import { Draw } from "./draw.js";
import { GIF } from "./gif.js";
import { getRandomFromMax } from './utils.js';

export class App {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.canvas.width = CANVAS_DIMENSION.width;
    this.canvas.height = CANVAS_DIMENSION.height;

    this.drawHelper = new Draw(this.ctx);

    this.gameState = GAME_STATE_READY;

    this.music = document.getElementById("music");
    this.dieMusic = document.getElementById("dieMusic");

    window.addEventListener("keydown", (e) => {
      if (this.bulletImage) {
        this.onKeyEvent(e.key.toLowerCase(), true);
      }
    });

    window.addEventListener("keyup", (e) => {
      if (this.bulletImage) {
        this.onKeyEvent(e.key.toLowerCase());
      }
    });

    const bulletImage = new Image();
    bulletImage.src = "assets/gonjal.gif";
    bulletImage.onload = () => {
      this.bulletImage = bulletImage;
      
    };

    const backgroundGif = GIF();
    backgroundGif.load("assets/gonjal2.gif");  
    backgroundGif.onload = () => {
      this.endBackgroundImage = backgroundGif;
      this.init();
    }
  }

  makeBullets() {
    const bullets = [];
    for (let bulletIndex = 0; bulletIndex < this.bulletCount; bulletIndex++) {
      const coords = Bullet.draw();
      
      const index = getRandomFromMax(2) - 1;
      const dimension = [BIG_BULLET_DIMENSION, BULLET_DIMENSION][index];

      const bullet = new Bullet(this.player, this.bulletImage, {
        x: coords.x,
        y: coords.y,
        left: coords.left,
        top: coords.top,
        width: dimension.width,
        height: dimension.height,
      });
      bullets.push(bullet);
    }

    return bullets;
  }

  init() {
    this.bulletCount = 50;

    this.secondsPassed = 0;
    this.oldTimeStamp = 0;
    this.last;
    this.score = 0;
    this.level = 0;

    this.keyEvent = {
      left: false,
      right: false,
      top: false,
      bottom: false,
    };

    this.player = new Player({
      x: CANVAS_DIMENSION.width / 2,
      y: CANVAS_DIMENSION.height / 2,
    });

    this.bullets = this.makeBullets();
    this.render();
  }

  draw = () => {
    this.drawHelper.init({
      x: CANVAS_DIMENSION.width,
      y: CANVAS_DIMENSION.height,
    });

    this.drawHelper.background({
      fill: "black",
      x: CANVAS_DIMENSION.width,
      y: CANVAS_DIMENSION.height,
    });

    if (this.gameState === GAME_STATE_GAME_OVER) {
      
      this.endBackgroundImage.play();
      this.drawHelper.image({
        src: this.endBackgroundImage.image,
        x: 0,
         y: 0,
        endX: CANVAS_DIMENSION.width,
        endY: CANVAS_DIMENSION.height,
      });
    }

    if (this.gameState === GAME_STATE_READY) {
      this.drawHelper.text({ text: "시작 = 엔터", x: 0, y: FONT_SIZE * 2 });
    }

    if (this.gameState === GAME_STATE_GAME_OVER) {
      this.drawHelper.text({ text: `SCORE: ${this.score}`, x: 0, y: FONT_SIZE, fill: '#000', });
      this.drawHelper.text({
        fill: '#000',
        text: `${this.score} 로 사망ㅋ`,
        x: 0,
        y: FONT_SIZE * 2,
      });
      this.drawHelper.text({ fill: '#000', text: "시작 = 엔터 ㅋ", x: 0, y: FONT_SIZE * 3 });
    } else {
      this.drawHelper.text({ text: `SCORE: ${this.score}`, x: 0, y: FONT_SIZE });
    }

    if (this.gameState === GAME_STATE_PLAY) {
      for (const bullet of this.bullets) {
        if (bullet.checkPlayerHit(this.player.x, this.player.y)) {
          return this.gameOver();
        }

        if (bullet.updateDimension(this.secondsPassed, this.level)) {
          this.bullets = this.bullets.filter((x) => x !== bullet);
          const coords = Bullet.draw();

          const index = getRandomFromMax(2) - 1;
          const dimension = [BIG_BULLET_DIMENSION, BULLET_DIMENSION][index];

          const crreatedBullet = new Bullet(this.player, this.bulletImage, {
            x: coords.x,
            y: coords.y,
            left: coords.left,
            top: coords.top,
            width: dimension.width,
            height: dimension.height,
          });

          this.bullets.push(crreatedBullet);
        } else {
          this.drawHelper.image({
            src: bullet.src,
            x: bullet.x,
            y: bullet.y,
            endX: bullet.width,
            endY: bullet.height,
          });
        }
      }
    }

    if (this.player.src && this.gameState !== GAME_STATE_GAME_OVER) {
      this.player.update(this.keyEvent, this.secondsPassed);
      this.drawHelper.image({
        src: this.player.src,
        x: this.player.x,
        y: this.player.y,
        endX: PLAYER_DIMENSION.width,
        endY: PLAYER_DIMENSION.height,
      });
    }
  };

  gameStart() {
    this.gameState = GAME_STATE_PLAY;
    this.dieMusic.pause();
    this.music.play();
    this.init();
  }

  gameOver() {
    this.gameState = GAME_STATE_GAME_OVER;
    this.keyEvent = {
      left: false,
      right: false,
      top: false,
      bottom: false,
    };
    this.music.pause();
    this.dieMusic.play();
    this.clear();
  }

  render() {
    this.animate = requestAnimationFrame(this.loop.bind(this));
  }

  loop(timestamp) {
    this.secondsPassed = (timestamp - this.oldTimeStamp) / 1000;
    this.oldTimeStamp = timestamp;

    const isPlay = this.gameState === GAME_STATE_PLAY;
    if (isPlay && (!this.last || timestamp - this.last >= 1000)) {
      this.last = timestamp;
      this.score += SCORE;
      this.level += LEVEL_SPEED;
    }

    this.draw();
    this.animate = requestAnimationFrame(this.loop.bind(this));
  }

  clear() {
    cancelAnimationFrame(this.animate);
    this.animate = undefined;
  }

  onKeyEvent(keyname, isUp) {
    if (
      this.gameState === GAME_STATE_READY ||
      this.gameState === GAME_STATE_GAME_OVER
    ) {
      if (keyname === "enter") {
        this.gameStart();
      }

      return;
    }

    switch (keyname) {
      case "arrowright": {
        return (this.keyEvent.right = isUp ? true : false);
      }

      case "arrowleft": {
        return (this.keyEvent.left = isUp ? true : false);
      }

      case "arrowup": {
        return (this.keyEvent.top = isUp ? true : false);
      }

      case "arrowdown": {
        return (this.keyEvent.bottom = isUp ? true : false);
      }
    }
  }
}
