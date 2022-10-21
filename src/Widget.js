import crypto from 'crypto';
import EventSource from './EventSource.js';
import Theme from './Theme.js';

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

  // extended classes need access to these.
  _absolutePosition = false;
  _parent = null;
  _theme = null;
  _mousePosX = 0;
  _mousePosY = 0;
  _mouseHover = false;
  _mouseDown = false;
  _mouseClick = false;
  _onMouseClick = null;

  _container = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  };

  _tint = {
    r: 0,
    g: 0,
    b: 0,
    a: 0,
  };

  constructor(parent = null, name = crypto.randomUUID(), themeColor = Theme.Colors.Inherit) {
    super();

    this.#name = name;

    if (themeColor) {
      if (themeColor === Theme.Colors.Inherit) {
        this._theme = null;
      } else {
        this._theme = new Theme(themeColor);
      }
    }

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
    const w = this.#fixedWidth === 0 ? this._container.w : this.fixedWidth;
    const h = this.#fixedHeight === 0 ? this._container.h : this.fixedHeight;
    return {
      x: this._container.x + this.#padding.l,
      y: this._container.y + this.#padding.t,
      w: w - this.#padding.l - this.#padding.r,
      h: h - this.#padding.t - this.#padding.b,
    };
  }

  get container() {
    return this._container;
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

  get theme() {
    if (this._theme === null) {
      if (this._parent !== null) {
        return this._parent.theme;
      }
      return new Theme(Theme.Colors.Blue);
    }
    return this._theme;
  }

  set theme(val) {
    if (val) {
      if (val === Theme.Colors.Inherit) {
        this._theme = null;
      } else {
        this._theme = new Theme(val);
      }
    }

    if (this._parent) {
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
      this._mousePosX > this._container.x
      && this._mousePosX < this._container.x + this._container.w
      && this._mousePosY > this._container.y
      && this._mousePosY < this._container.y + this._container.h
    ) {
      this._mouseHover = true;
    } else {
      this._mouseHover = false;
    }
  }

  _eventMouseButtonDown() {
    if (
      this._mousePosX > this._container.x
      && this._mousePosX < this._container.x + this._container.w
      && this._mousePosY > this._container.y
      && this._mousePosY < this._container.y + this._container.h
    ) {
      this._mouseDown = true;
    } else {
      this._mouseDown = false;
    }
    return false;
  }

  _eventMouseButtonUp() {
    if (
      this._mousePosX > this._container.x
      && this._mousePosX < this._container.x + this._container.w
      && this._mousePosY > this._container.y
      && this._mousePosY < this._container.y + this._container.h
    ) {
      this._mouseDown = true;
      this._mouseClick = true;
    } else {
      this._mouseDown = false;
    }
    return false;
  }

  setContainer(x, y, w, h) {
    if (
      this._container.x !== x
      || this._container.y !== y
      || this._container.w !== w
      || this._container.h !== h
    ) {
      this._container.x = x;
      this._container.y = y;
      this._container.w = w;
      this._container.h = h;
      this._performLayout();
    }
  }

  setPadding(top, bottom, left, right) {
    this.#padding = {
      t: top,
      b: bottom,
      l: left,
      r: right,
    };

    if (this._parent) {
      this._parent._performLayout();
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
        this._container.x,
        this._container.y,
        this._container.w,
        this._container.h,
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
    // canvasCtx.rect(this._container.x, this._container.y, this._container.w, this._container.h);
    // canvasCtx.stroke();
    // canvasCtx.restore();
  }

  draw(canvasCtx, depth = 0) {
    this._preDraw(canvasCtx, depth);
    this._draw(canvasCtx, depth);
    this._postDraw(canvasCtx, depth);
  }
}
