import crypto from 'crypto';
import Colors from './Colors.js';
import Container from './Container.js';

class Shade extends Container {
  #color;
  #opacity = 0.25;

  /**
   * Create a new Spinner.
   * @param {Widget} parent Assign a parent Widget during creation
   * @param {String} name Assign a name during creation
   */
  constructor(parent = null, name = crypto.randomUUID()) {
    super(parent, name);

    this._absolutePosition = true;
    this.color = Colors.Black;
    this.container = [0, 0, global.window.width, global.window.height];

    this.onMouseClick = () => true;

    if (new.target === Shade) {
      Object.preventExtensions(this);
    }
  }

  get color() {
    return this.#color;
  }

  set color(val) {
    if (typeof val !== 'string'
    || val.length !== 7
    || val[0] !== '#') {
      throw new Error('Invalid color');
    }

    this.#color = val;
  }

  get opacity() {
    return this.#opacity;
  }

  set opacity(val) {
    if (Number.isNaN(Number(val)) || val < 0 || val > 1) {
      throw new Error('Value number be a number between 0 and 1');
    }

    this.#opacity = val;
  }

  _draw(canvasCtx, depth = 0) {
    if (this.constructor.name === 'Shade') {
      this._logme(depth);
    }

    let opacity = (256 * (1 - this.#opacity)).toString(16);
    if (opacity.length === 1) {
      opacity = `0${opacity}`;
    }

    canvasCtx.fillStyle = `${this.#color}${opacity}`;

    canvasCtx.fillRect(
      this.container.x,
      this.container.y,
      this.container.w,
      this.container.h,
    );

    super._draw(canvasCtx, depth);
  }
}

export default Shade;
