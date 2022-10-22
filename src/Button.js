import crypto from 'crypto';
import Container from './Container.js';
import Theme from './Theme.js';

export default class Button extends Container {
  constructor(parent = null, name = crypto.randomUUID()) {
    super(parent, name);

    this.setPadding(5, 5, 10, 10);

    if (new.target === Button) {
      Object.preventExtensions(this);
    }
  }

  _draw(canvasCtx, depth = 0) {
    if (this.constructor.name === 'Button') {
      this._logme(depth);
    }

    let part = Theme.Parts.Button;
    if (this._mouseHover && !this._mouseDown) {
      part = Theme.Parts.ButtonHover;
    }
    if (this._mouseHover && this._mouseDown) {
      part = Theme.Parts.ButtonPressed;
    }

    this.theme.draw9slice(
      canvasCtx,
      part,
      this.container.x,
      this.container.y,
      this.container.w,
      this.container.h,
    );

    super._draw(canvasCtx, depth);
  }
}
