import { FONT_SIZE } from "./constant.js";

export class Draw {
  constructor(ctx) {
    this.ctx = ctx;
  }

  init({ x, y }) {
    this.ctx.clearRect(0, 0, x, y);
  }

  text({ text, x, y, fill }) {
    let localFill = fill;
    if (!localFill) localFill = '#fff';
    this.ctx.fillStyle = localFill;
    this.ctx.font = FONT_SIZE / 2 + "px sans";
    this.ctx.fillText(text, x, y);
  }

  background({ x, y, fill }) {
    this.ctx.fillStyle = fill;
    this.ctx.fillRect(0, 0, x, y);
  }

  image({ src, x, y, endX, endY }) {
    this.ctx.drawImage(src, x, y, endX, endY);
  }
}
