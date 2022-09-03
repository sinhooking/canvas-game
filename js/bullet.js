import {
  PLAYER_SPEED,
  PLAYER_DIMENSION,
  CANVAS_DIMENSION,
  BULLET_DIMENSION,
} from "./constant.js";
import { getRandomFromMax } from "./utils.js";

export class Bullet {
  constructor(player, asset, { x, y, left, top, width, height }) {
      
    this.x = x;
    this.y = y;
    if (this.checkPlayerHit(player.x, player.y)) {
        this.x -= PLAYER_DIMENSION.width * 2;
        this.y -= PLAYER_DIMENSION.height  * 2;
    }
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
    this.src = asset;
  }

  checkPlayerHit(playerX, playerY) {
    const playerXLeft = parseInt(playerX);
    const playerXRightDimension = parseInt(playerX) + PLAYER_DIMENSION.width;

    const playerYLeft = parseInt(playerY);
    const playerYRightDimension = parseInt(playerY) + PLAYER_DIMENSION.width;

    const isIncludeFromX = playerXLeft < this.x && playerXRightDimension > this.x;
    const isIncludeFromY = playerYLeft < this.y && playerYRightDimension > this.y;
    if (isIncludeFromX && isIncludeFromY) {
      return true;
    }

    return false;
  }

  static draw () {
    const startTypes = ["left", "right", "top", "bottom"];

    const coords = {
      x: 0,
      y: 0,
      left: 0,
      top: 0,
    };

    const index = getRandomFromMax(4);
    const key = startTypes[index];
    switch (key) {
      case "left":
        coords.x = 0;
        coords.y = getRandomFromMax(CANVAS_DIMENSION.height);
        coords.left = getRandomFromMax(2);
        coords.top = -2 + getRandomFromMax(4);
        break;
      case "right":
        coords.x = CANVAS_DIMENSION.width;
        coords.y = getRandomFromMax(CANVAS_DIMENSION.height);
        coords.left = -getRandomFromMax(2);
        coords.top = -2 + getRandomFromMax(4);
        break;
      case "top":
        coords.x = getRandomFromMax(CANVAS_DIMENSION.width);
        coords.y = 0;
        coords.left = -2 + getRandomFromMax(4);
        coords.top = getRandomFromMax(2);
        break;

      case "bottom":
        coords.x = getRandomFromMax(CANVAS_DIMENSION.width);
        coords.y = CANVAS_DIMENSION.height;
        coords.left = -2 + getRandomFromMax(4);
        coords.top = -getRandomFromMax(2);
        break;
      default:
        break;
    }

    return coords;
  }

  reDraw () {
    const coords = Bullet.draw();
    this.x = coords.x;
    this.y = coords.x;
    this.left = coords.x;
    this.top = coords.x;
  }

  updateDimension(smooth, level) {
    this.x += (this.left * (PLAYER_SPEED / 4 * smooth + level));
    this.y += (this.top * (PLAYER_SPEED / 4 * smooth + level));
   
    if (this.x <= 0 || this.x >= CANVAS_DIMENSION.width || this.y <= 0 || this.y >= CANVAS_DIMENSION.height) {
      return true;
    }

    return false;
  }
}
