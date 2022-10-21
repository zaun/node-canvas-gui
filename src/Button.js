"use strict"

import crypto from 'crypto';
import Container from './Container.js';
import Theme from './Theme.js';

export default class Button extends Container {

  constructor(parent = null, name = crypto.randomUUID()) {
    super(parent, name);

    this.setPadding(5, 5, 10, 10);

    if (new.target === Button) {
      Object.preventExtensions(this)
    }
  }

  _draw(canvasCtx, depth = 0) {
    if (this.constructor.name === 'Button') {
      this._logme(depth);
    }

    if (this._mouseHover) {
      this.theme.draw9slice(canvasCtx, Theme.Parts.ButtonHover, this.container.x, this.container.y, this.container.w, this.container.h);
    } else {
      this.theme.draw9slice(canvasCtx, Theme.Parts.Button, this.container.x, this.container.y, this.container.w, this.container.h);
    }

    super._draw(canvasCtx, depth);
  }
}
