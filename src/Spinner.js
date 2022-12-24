import crypto from 'crypto';
import Widget from './Widget.js';

class Spinner extends Widget {
  /**
   * Create a new Spinner.
   * @param {Widget} parent Assign a parent Widget during creation
   * @param {String} name Assign a name during creation
   */
  constructor(parent = null, name = crypto.randomUUID()) {
    super(parent, name);

    if (new.target === Spinner) {
      Object.preventExtensions(this);
    }
  }

  _draw(canvasCtx, depth = 0) {
    if (this.constructor.name === 'Spinner') {
      this._logme(depth);
    }

    super._draw(canvasCtx, depth);
  }
}

export default Spinner;
