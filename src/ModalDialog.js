"use strict"

import crypto from 'crypto';
import Widget from './Widget.js';
import Container from './Container.js';
import Panel from './Panel.js';

// Force a fullscreen dialog that will prevent
// mouse clicks from propigating to items below it.

export default class ModalDialog extends Container {
  #modalRoot = new Container(null, 'ModalDialog Root');
  #modalCenter = new Container();
  #modalBody = new Panel(null, 'ModalDialog Body');

  constructor(parent = null, name = crypto.randomUUID()) {
    super(parent, name);

    this._absolutePosition = true;

    this.#modalRoot.setContainer(0, 0, global.window.width, global.window.height);
    this.#modalRoot.backgroundColor = '#00000088';
    this.#modalRoot.addChild(new Widget());
    this.#modalCenter.orientation = Container.Orientation.Vertical;
    this.#modalRoot.addChild(this.#modalCenter);
    this.#modalRoot.addChild(new Widget());
    this.#modalRoot._absolutePosition = true;

    this.#modalCenter.addChild(new Widget());
    this.#modalCenter.addChild(this.#modalBody);
    this.#modalCenter.addChild(new Widget());

    this.#modalBody.setPadding(25, 25, 25, 25);

    this.#modalRoot.onMouseClick = () => {
      return true;
    }
    this.onMouseClick = () => {
      return true;
    }

    if (new.target === ModalDialog) {
      Object.preventExtensions(this)
    }
  }

  get fixedHeight() {
    return this.#modalBody.fixedHeight;
  }

  get fixedWidth() {
    return this.#modalCenter.fixedWidth;
  }

  get theme() {
    return this.#modalRoot.theme;
  }

  set fixedHeight(val) {
    this.#modalBody.fixedHeight = val;
  }

  set fixedWidth(val) {
    this.#modalCenter.fixedWidth = val;
  }

  set theme(val) {
    this.#modalRoot.theme = val;
  }

  set onMouseClick(val) {
    this.#modalBody.onMouseClick = val;
  }

  addChild(child) {
    this.#modalBody.addChild(child);
  }

  setPadding(top, bottom, left, right) {
    this.#modalBody.setPadding(top, bottom, left, right);
  }

  _eventMouseMove(event) {
    this.#modalRoot._eventMouseMove(event);
    return true;
  }

  _eventMouseButtonDown(event) {
    this.#modalRoot._eventMouseButtonDown(event);
    return true;
  }

  _eventMouseButtonUp(event) {
    this.#modalRoot._eventMouseButtonUp(event);
    return true;
  }

  _draw(canvasCtx, depth) {
    super._draw(canvasCtx, depth);
    if (this.constructor.name === 'ModalDialog') {
      this._logme(depth);
    }
  }

  _postDraw(canvasCtx, depth) {
    super._postDraw(canvasCtx, depth);

    this.#modalRoot.draw(canvasCtx, depth + 1);
    if (this.parent) {
      this.parent._mouseClick = this.#modalRoot._mouseClick;
    }
  }
}
