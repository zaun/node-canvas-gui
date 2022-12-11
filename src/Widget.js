import crypto from 'crypto';
import EventSource from './EventSource.js';

export default class Widget extends EventSource {
  static #debug = false;

  static get debug() {
    return Widget.#debug;
  }

  static set debug(val) {
    Widget.#debug = val === true;
  }

  #name = '';
  #visible = true;
  #backgroundColor = '#00000000';
  #borderColor = '#000000';

  #fixedWidth = 0;
  #fixedHeight = 0;

  #padding = {
    t: 0,
    b: 0,
    l: 0,
    r: 0,
  };

  #container = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  };

  // extended classes need access to these.
  _indent = 0; // indent for body that is not use controlled. Set by widget based
  _absolutePosition = false;
  _parent = null;
  _mousePosX = 0;
  _mousePosY = 0;
  _mouseHover = false;
  _mouseDown = false;
  _mouseClick = false;
  _onMouseClick = null;

  _tint = {
    r: 0,
    g: 0,
    b: 0,
    a: 0,
  };

  constructor(parent = null, name = crypto.randomUUID()) {
    super();

    this.#name = name;

    if (parent !== null && parent.addChild) {
      parent.addChild(this);
    } else if (parent !== null) {
      throw new Error(`Parent widget type must be a Container but got: ${parent.constructor}`);
    }

    if (new.target === Widget) {
      Object.preventExtensions(this);
    }
  }

  get body() {
    let x = this.container.x + this.#padding.l + this._indent;
    if (x < 0) {
      x = 0;
    }
    let y = this.container.y + this.#padding.t + this._indent;
    if (y < 0) {
      y = 0;
    }
    let w = this.container.w - this.#padding.l - this.#padding.r - this._indent - this._indent;
    if (w < 0) {
      w = 0;
    }
    let h = this.container.h - this.#padding.t - this.#padding.b - this._indent - this._indent;
    if (h < 0) {
      h = 0;
    }
    return {
      x, y, w, h,
    };
  }

  get container() {
    const w = this.#fixedWidth === 0 ? this.#container.w : this.fixedWidth;
    const h = this.#fixedHeight === 0 ? this.#container.h : this.fixedHeight;
    return {
      x: this.#container.x,
      y: this.#container.y,
      w,
      h,
    };
  }

  get padding() {
    return this.#padding;
  }

  get mouseClick() {
    return this._mouseClick;
  }

  get mouseHover() {
    return this._mouseHover;
  }

  get name() {
    return this.#name;
  }

  get visible() {
    return this.#visible;
  }

  get backgroundColor() {
    return this.#backgroundColor;
  }

  set backgroundColor(val) {
    let color = val;
    if (color[0] !== '#') {
      return;
    }
    if (color.length !== 7 && color.length !== 9) {
      return;
    }
    if (color.length === 7) {
      color += 'FF';
    }
    this.#backgroundColor = color;
  }

  get borderColor() {
    return this.#borderColor;
  }

  set borderColor(val) {
    const color = val;
    if (color[0] !== '#') {
      return;
    }
    if (color.length !== 7) {
      return;
    }
    this.#borderColor = color;
  }

  get fixedHeight() {
    return this.#fixedHeight;
  }

  set fixedHeight(val) {
    if (val < 0) {
      throw Error('Widget \'fixedHeight\' must be greater to or equal to 0.');
    }

    if (this.#fixedHeight !== val) {
      this.#fixedHeight = val;
      if (this._parent) {
        this._parent._performLayout();
      }
    }
  }

  get fixedWidth() {
    return this.#fixedWidth;
  }

  set fixedWidth(val) {
    if (val < 0) {
      throw Error('Widget \'fixedWidth\' must be greater to or equal to 0.');
    }

    if (this.#fixedWidth !== val) {
      this.#fixedWidth = val;
      if (this._parent) {
        this._parent._performLayout();
      }
    }
  }

  get parent() {
    return this._parent;
  }

  set parent(val) {
    this._parent = val;
    if (this._parent && this._parent._performLayout) {
      this._parent._performLayout();
    }
  }

  set onMouseClick(val) {
    this._onMouseClick = null;
    if (typeof val === 'function') {
      this._onMouseClick = val;
    }
  }

  _eventMouseMove(event) {
    this._mousePosX = event.x;
    this._mousePosY = event.y;
    if (
      this._mousePosX > this.#container.x
      && this._mousePosX < this.#container.x + this.#container.w
      && this._mousePosY > this.#container.y
      && this._mousePosY < this.#container.y + this.#container.h
    ) {
      this._mouseHover = true;
    } else {
      this._mouseHover = false;
    }
  }

  _eventMouseButtonDown() {
    if (
      this._mousePosX > this.#container.x
      && this._mousePosX < this.#container.x + this.#container.w
      && this._mousePosY > this.#container.y
      && this._mousePosY < this.#container.y + this.#container.h
    ) {
      this._mouseDown = true;
    } else {
      this._mouseDown = false;
    }
    return false;
  }

  _eventMouseButtonUp() {
    if (
      this._mousePosX > this.#container.x
      && this._mousePosX < this.#container.x + this.#container.w
      && this._mousePosY > this.#container.y
      && this._mousePosY < this.#container.y + this.#container.h
    ) {
      this._mouseClick = true;
    }
    this._mouseDown = false;
    return false;
  }

  // eslint-disable-next-line class-methods-use-this
  _eventKeyDown() { }

  // eslint-disable-next-line class-methods-use-this
  _eventMouseWheel() {}

  setContainer(x, y, width, height) {
    if (x < 0) {
      throw Error('Container \'x\' location must be greater to or equal to 0.');
    }
    if (y < 0) {
      throw Error('Container \'y\' location must be greater to or equal to 0.');
    }
    if (width < 0) {
      throw Error('Container \'width\' location must be greater to or equal to 0.');
    }
    if (height < 0) {
      throw Error('Container \'height\' location must be greater to or equal to 0.');
    }

    if (
      this.#container.x !== x
      || this.#container.y !== y
      || this.#container.w !== width
      || this.#container.h !== height
    ) {
      this.#container.x = x;
      this.#container.y = y;
      this.#container.w = width;
      this.#container.h = height;
      this._performLayout();
    }
  }

  setPadding(top, bottom, left, right) {
    if (top < 0) {
      throw Error('Padding \'top\' location must be greater to or equal to 0.');
    }
    if (bottom < 0) {
      throw Error('Padding \'bottom\' location must be greater to or equal to 0.');
    }
    if (left < 0) {
      throw Error('Padding \'left\' location must be greater to or equal to 0.');
    }
    if (right < 0) {
      throw Error('Padding \'right\' location must be greater to or equal to 0.');
    }

    this.#padding = {
      t: top,
      b: bottom,
      l: left,
      r: right,
    };

    if (this._parent) {
      this._parent._performLayout();
    } else {
      this._performLayout();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  _performLayout() { }

  _logme(depth) {
    if (!Widget.#debug) {
      return;
    }
    // eslint-disable-next-line no-console
    console.log(`${'   '.repeat(depth)}${this.constructor.name} ${this.name} ${JSON.stringify(this.container)}`);
  }

  _preDraw(canvasCtx) {
    if (this._mouseClick && this._onMouseClick !== null) {
      if (this._onMouseClick() === true) {
        let p = this._parent;
        while (p !== null) {
          p._mouseClick = false;
          p = p._parent;
        }
      }
    }
    this._mouseClick = false;

    const alpha = this.#backgroundColor.slice(-2);
    if (alpha !== '00') {
      canvasCtx.save();
      canvasCtx.fillStyle = this.#backgroundColor;
      canvasCtx.fillRect(
        this.#container.x,
        this.#container.y,
        this.#container.w,
        this.#container.h,
      );
      canvasCtx.restore();
    }
  }

  _draw(canvasCtx, depth) {
    if (this.constructor.name === 'Widget') {
      this._logme(depth);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  _postDraw() {
    // canvasCtx.save();
    // canvasCtx.beginPath();
    // canvasCtx.strokeStyle = this.#borderColor;
    // canvasCtx.rect(this.#container.x, this.#container.y, this.#container.w, this.#container.h);
    // canvasCtx.stroke();
    // canvasCtx.restore();
  }

  draw(canvasCtx, depth = 0) {
    this._preDraw(canvasCtx, depth);
    this._draw(canvasCtx, depth);
    this._postDraw(canvasCtx, depth);
  }
}
