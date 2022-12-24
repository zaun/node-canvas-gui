import crypto from 'crypto';
import Container from './Container.js';
import Colors from './Colors.js';

/**
 * The Panel widget is a bin that surrounds its child with a decorative frame
 * and backround.
 * @extends Container
 */
class Panel extends Container {
  static Mode = {
    Default: 'Default',
    Outline: 'Outline',
  };

  #bgColor = '';
  #borderColor = '';
  #mode = Panel.Mode.Default;
  #borderWidth = 4;
  #radii = [8, 8, 8, 8];

  /**
   * Create a new Panel.
   * @param {Widget} parent Assign a parent Widget during creation
   * @param {String} name Assign a name during creation
   */
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

  set radii(val) {
    const onlyNumbers = (a) => a.every((i) => typeof i === 'number');

    if (!Number.isNaN(Number(val))) {
      this.#radii = [val, val, val, val];
    } else if (Array.isArray(val) && val.length === 4 && onlyNumbers(val)) {
      this.#radii = val;
    } else {
      throw Error('Panel radii must be a number or an array of four numbers');
    }
  }

  get radii() {
    return this.#radii;
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
      this.container.x + Math.floor(canvasCtx.lineWidth / 2),
      this.container.y + Math.floor(canvasCtx.lineWidth / 2),
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

export default Panel;
