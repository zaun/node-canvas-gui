import crypto from 'crypto';
import Container from './Container.js';
import Theme from './Theme.js';

export default class Button extends Container {
  constructor(parent = null, name = crypto.randomUUID()) {
    super(parent, name);

    if (new.target === Button) {
      Object.preventExtensions(this);
    }
  }

  _draw(canvasCtx, depth = 0) {
    if (this.constructor.name === 'Button') {
      this._logme(depth);
    }

    // Theme changed
    const info = this.theme.getPartInfo(Theme.Parts.Button);
    if (this._indent !== info.bgIndent) {
      this._indent = info.bgIndent + 2;
      this._performLayout();
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
