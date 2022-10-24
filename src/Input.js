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
  #size = 16;

  constructor(parent = null, name = crypto.randomUUID()) {
    super(parent, name);

    this.fixedHeight = 49;
    this.setPadding(10, 15, 10, 10);

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
      console.log(key);
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

    this.theme.draw9slice(
      canvasCtx,
      Theme.Parts.InputBackground,
      this.container.x,
      this.container.y,
      this.container.w,
      this.container.h,
    );

    canvasCtx.save();
    canvasCtx.rect(this.body.x, this.body.y, this.body.w, this.body.h);
    canvasCtx.clip();

    canvasCtx.fillStyle = this.#value === '' ? '#666666' : '#000000';
    canvasCtx.font = `${this.#size}px ${this.#font}`;

    const chInfo = canvasCtx.measureText('$');
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
