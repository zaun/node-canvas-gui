import crypto from 'crypto';
import Container from './Container.js';
import Theme from './Theme.js';

export default class Panel extends Container {
  constructor(parent = null, name = crypto.randomUUID()) {
    super(parent, name);

    if (new.target === Panel) {
      Object.preventExtensions(this);
    }
  }

  _draw(canvasCtx, depth = 0) {
    if (this.constructor.name === 'Panel') {
      this._logme(depth);
    }

    this.theme.draw9slice(
      canvasCtx,
      Theme.Parts.Panel,
      this.container.x,
      this.container.y,
      this.container.w,
      this.container.h,
      this.theme.colors.background,
    );

    super._draw(canvasCtx, depth);
  }
}
