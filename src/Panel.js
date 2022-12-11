import crypto from 'crypto';
import Container from './Container.js';
import Colors from './Colors.js';

export default class Panel extends Container {
  static Mode = {
    Default: 'Default',
    Outline: 'Outline',
  };

  #bgColor = '';
  #borderColor = '';
  #mode = Panel.Mode.Default;
  #borderWidth = 4;
  #radii = [8, 8, 8, 8];

  constructor(parent = null, name = crypto.randomUUID()) {
    super(parent, name);

    this.setColor(Colors.Gray);

    if (new.target === Panel) {
      Object.preventExtensions(this);
    }
  }

  set backgroundColor(val) {
    this.#bgColor = val;
  }

  get backgroundColor() {
    return this.#bgColor;
  }

  set borderColor(val) {
    this.#borderColor = val;
  }

  get borderColor() {
    return this.#borderColor;
  }

  set borderWidth(val) {
    this.#borderWidth = val * 4;
  }

  get borderWidth() {
    return this.#borderWidth / 4;
  }

  set mode(val) {
    this.#mode = val;
  }

  get mode() {
    return this.#mode;
  }

  setColor(val) {
    this.#bgColor = val;
    this.#borderColor = Colors.darker(val);
  }

  _draw(canvasCtx, depth = 0) {
    if (this.constructor.name === 'Panel') {
      this._logme(depth);
    }

    canvasCtx.beginPath();

    canvasCtx.lineWidth = this.#borderWidth;
    canvasCtx.fillStyle = this.#bgColor;
    canvasCtx.strokeStyle = this.#borderColor;

    canvasCtx.roundRect(
      this.container.x + (canvasCtx.lineWidth / 2),
      this.container.y + (canvasCtx.lineWidth / 2),
      this.container.w - canvasCtx.lineWidth,
      this.container.h - canvasCtx.lineWidth,
      this.#radii,
    );

    if (this.mode === Panel.Mode.Default || this.mode === Panel.Mode.Outline) {
      canvasCtx.stroke();
    }

    if (this.mode === Panel.Mode.Default) {
      canvasCtx.fill();
    }

    super._draw(canvasCtx, depth);
  }
}
