import { PLAYER_DIMENSION, PLAYER_SPEED, CANVAS_DIMENSION  } from "./constant.js";

export class Player {
  constructor({ x, y }) {
    this.x = x - PLAYER_DIMENSION.width / 2;
    this.y = y + PLAYER_DIMENSION.height;
    this.src = null;

    const image = new Image();
    image.src = "/assets/deniaul.gif";
    image.onload = () => (this.src = image);
  }

  update(userKeyEvents, smooth) {
    if (userKeyEvents.left) {
      if (this.x <= 0) {
        this.x = 0;
      } else {
        this.x -= PLAYER_SPEED * smooth;
      }
    }

    if (userKeyEvents.right) {
      const endX = CANVAS_DIMENSION.width - PLAYER_DIMENSION.width;
      if (this.x >= endX) {
        this.x = endX;
      } else {
        this.x += PLAYER_SPEED * smooth;
      }
    }

    if (userKeyEvents.top) {
      if (this.y <= 0) {
        this.y = 0;
      } else {
        this.y -= PLAYER_SPEED * smooth;
      }
    }

    if (userKeyEvents.bottom) {
      const endY = CANVAS_DIMENSION.height - PLAYER_DIMENSION.height;
      if (this.y >= endY) {
        this.y = endY;
      } else {
        this.y += PLAYER_SPEED * smooth;
      }
    }
  }
}
