import crypto from 'crypto';
import Container from './Container.js';
import Theme from './Theme.js';

export default class Button extends Container {
  constructor(parent = null, name = crypto.randomUUID()) {
    super(parent, name);

    this.setPadding(5, 5, 5, 5);

    if (new.target === Button) {
      Object.preventExtensions(this);
    }
  }

  _draw(canvasCtx, depth = 0) {
    if (this.constructor.name === 'Button') {
      this._logme(depth);
    }

    let part = Theme.Parts.Button;
    let background = this.theme.colors.action;
    if (this._mouseHover && !this._mouseDown) {
      part = Theme.Parts.ButtonHover;
      background = this.theme.colors.actionHighlight;
    }
    if (this._mouseHover && this._mouseDown) {
      part = Theme.Parts.ButtonPressed;
      background = this.theme.colors.actionPressed;
    }

    this.theme.draw9slice(
      canvasCtx,
      part,
      this.container.x,
      this.container.y,
      this.container.w,
      this.container.h,
      background,
    );

    super._draw(canvasCtx, depth);
  }
}
