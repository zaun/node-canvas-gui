import crypto from 'crypto';
import Colors from './Colors.js';
import Widget from './Widget.js';

export default class Label extends Widget {
  #text = '';
  #font = 'sans';
  #size = -1; // Default to auto-font size
  #foreground = '';

  constructor(parent = null, name = crypto.randomUUID()) {
    super(parent, name);

    this.setPadding(3, 3, 3, 3);

    if (new.target === Label) {
      Object.preventExtensions(this);
    }
  }

  get text() {
    return this.#text;
  }

  set text(val) {
    this.#text = val.toString();
  }

  get font() {
    return this.#font;
  }

  set font(val) {
    this.#font = val;
  }

  get fontSize() {
    return this.#size;
  }

  set fontSize(val) {
    this.#size = val;
  }

  get foreground() {
    return this.#foreground;
  }

  set foreground(val) {
    this.#foreground = val;
  }

  _draw(canvasCtx, depth = 0) {
    super._draw(canvasCtx, depth);

    if (this.constructor.name === 'Label') {
      this._logme(depth);
    }

    canvasCtx.save();
    canvasCtx.rect(this.body.x, this.body.y, this.body.w, this.body.h);
    canvasCtx.clip();

    const lines = this.#text.split('\n');

    // Calculate max font size if set font size is -1
    let fontSize = this.#size === -1 ? 0.5 : this.#size;
    let chInfo = null;
    let lineHeight = 0;
    do {
      fontSize += 0.5;
      canvasCtx.font = `${fontSize}px ${this.#font}`;
      chInfo = canvasCtx.measureText('$');
      lineHeight = chInfo.emHeightAscent + chInfo.emHeightDescent + 2;
    } while (this.#size === -1 && (lineHeight * lines.length) < this.body.h);

    canvasCtx.fillStyle = this.#foreground === '' ? Colors.Black : this.#foreground;

    let maxWidth = 0;
    for (let i = 0; i < lines.length; i += 1) {
      const lineWidth = canvasCtx.measureText(lines[i]).width;
      if (lineWidth > maxWidth) {
        maxWidth = lineWidth;
      }
    }

    for (let i = 0; i < lines.length; i += 1) {
      let x = this.body.x + (this.body.w / 2) - (maxWidth / 2);
      if (x < this.body.x) {
        x = this.body.x;
      }

      let y = this.body.y + (this.body.h / 2);
      y += (chInfo.emHeightAscent / 2);
      y -= (chInfo.emHeightDescent / 2);
      y += (i * lineHeight);
      if (y < this.body.y) {
        y = this.body.y;
      }

      canvasCtx.fillText(lines[i], x, y);
    }

    canvasCtx.restore();
  }
}
