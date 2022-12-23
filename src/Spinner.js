import crypto from 'crypto';
import Widget from './Widget.js';

export default class Spinner extends Widget {
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
