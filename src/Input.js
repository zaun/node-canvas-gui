import crypto from 'crypto';
import Theme from './Theme.js';
import Widget from './Widget.js';

export default class Input extends Widget {
  static #blink = false;
  static #blinker;

  static {
    Input.#blinker = setInterval(() => {
      Input.#blink = !Input.#blink;
    }, 500);
    Input.#blinker.unref();
  }

  #value = '';
  #placeholder = 'Enter your full name...';
  #offset = 0;

  #font = 'sans';
  #size = -1; // Default to auto-font size

  constructor(parent = null, name = crypto.randomUUID()) {
    super(parent, name);

    this.fixedHeight = 49;
    const info = this.theme.getPartInfo(Theme.Parts.InputBackground);
    this._indent = info.bgIndent + 2;
    this.setPadding(3, 3, 3, 3);

    if (new.target === Input) {
      Object.preventExtensions(this);
    }
  }

  get value() {
    return this.#value;
  }

  set value(val) {
    this.#value = val.toString();
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

  _eventKeyDown(event) {
    if (!this._mouseHover) {
      return;
    }
    let { key } = event;
    if (key === 'space') {
      key = ' ';
    }
    if (key === 'backspace') {
      key = '';
      this.#value = this.#value.slice(0, -1);
      return;
    }
    if (key.length > 1) {
      // eslint-disable-next-line no-console
      // console.log(key);
      key = '';
    }
    if (event.shift || event.capslock) {
      key = key.toUpperCase();
    }
    this.#value += key;
  }

  _draw(canvasCtx, depth = 0) {
    super._draw(canvasCtx, depth);
    if (this.constructor.name === 'Input') {
      this._logme(depth);
    }

    let background = this.theme.colors.action;
    if (this._mouseHover) {
      background = this.theme.colors.actionHighlight;
    }

    this.theme.draw9slice(
      canvasCtx,
      Theme.Parts.InputBackground,
      this.container.x,
      this.container.y,
      this.container.w,
      this.container.h,
      background,
    );

    canvasCtx.save();
    canvasCtx.rect(this.body.x, this.body.y, this.body.w, this.body.h);
    canvasCtx.clip();

    // Set the font color
    canvasCtx.fillStyle = this.theme.colors.actionForeground;
    if (this.#value === '') {
      canvasCtx.fillStyle = this.theme.colors.actionLightForeground;
    }

    // Calculate max font size if set font size is -1
    let fontSize = this.#size === -1 ? 0.5 : this.#size;
    let chInfo = null;
    let lineHeight = 0;
    do {
      fontSize += 0.5;
      canvasCtx.font = `${fontSize}px ${this.#font}`;
      chInfo = canvasCtx.measureText('$');
      lineHeight = chInfo.emHeightAscent + chInfo.emHeightDescent + 2;
    } while (this.#size === -1 && lineHeight < this.body.h);

    // Scroll text if it wont all fit
    const lineWidth = canvasCtx.measureText(this.#value).width;
    this.#offset = lineWidth > this.body.w - 5 ? lineWidth - (this.body.w - 5) : 0;

    const x = this.body.x - this.#offset;
    let y = this.body.y + (this.body.h / 2);
    y += (chInfo.emHeightAscent / 2);
    y -= (chInfo.emHeightDescent / 2);

    canvasCtx.fillText(this.#value || this.#placeholder, x, y);

    // Draw the text baseline
    // canvasCtx.beginPath();
    // canvasCtx.moveTo(this.body.x, y);
    // canvasCtx.lineTo(this.body.x + this.body.w, y);
    // canvasCtx.stroke();

    const lineX = x + lineWidth + 2;

    if (this._mouseHover && Input.#blink) {
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = '#0000000';
      canvasCtx.beginPath();
      canvasCtx.moveTo(lineX, this.body.y);
      canvasCtx.lineTo(lineX, this.body.y + this.body.h);
      canvasCtx.stroke();
    }

    canvasCtx.restore();
  }
}
