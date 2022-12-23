import crypto from 'crypto';
import EventSource from './EventSource.js';

export default class Widget extends EventSource {
  static #debug = false;
  static #testing = false;

  static get debug() {
    return Widget.#debug;
  }

  static set debug(val) {
    Widget.#debug = val === true;
  }

  static get testing() {
    return Widget.#testing;
  }

  static set testing(val) {
    Widget.#testing = val === true;
  }

  #name = '';
  #parent = null;

  #visible = true;
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

  #order = 0;
  #grow = 1;

  // extended classes need access to these.

  _mousePosX = 0;
  _mousePosY = 0;

  _mouseHover = false;
  _mouseDown = false;
  _mouseClick = false;
  _onMouseClick = null;

  constructor(parent = null, name = crypto.randomUUID()) {
    super();

    this.#name = name;

    if (parent !== null && parent.addChild) {
      parent.addChild(this);
    } else if (parent !== null) {
      throw new Error(`Parent widget type must be a Container but got: ${parent.constructor}`);
    }

    if (new.target === Widget && !Widget.testing) {
      Object.preventExtensions(this);
    }
  }

  set padding(val) {
    const onlyNumbers = (a) => a.every((i) => typeof i === 'number');

    if (!Number.isNaN(Number(val))) {
      this.#padding = {
        t: val,
        b: val,
        l: val,
        r: val,
      };
    } else if (Array.isArray(val) && val.length === 4 && onlyNumbers(val)) {
      this.#padding = {
        t: val[0],
        b: val[1],
        l: val[2],
        r: val[3],
      };
    } else {
      throw Error('Widget padding must be a number or an array of four numbers');
    }

    if (this.#parent) {
      this.#parent._performLayout();
    } else {
      this._performLayout();
    }
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

  get parent() {
    return this.#parent;
  }

  set parent(val) {
    // can't use instanceof here as it would cause a dependancy cycle
    if (val !== null && !val.addChild) {
      throw Error('Parent must be a Container or null.');
    }

    if (val === null) {
      this.#parent.removeChild(this);
      this.#parent = null;
    } else if (this.#parent === null || this.#parent.name !== val.name) {
      this.#parent = val;
      val.addChild(this);
    }
  }

  // #region Position and Size

  /**
   * The area of the widget that its contents are displayed. This is the
   * container minus the padding.
   */
  get body() {
    const x = this.container.x + this.#padding.l;
    const y = this.container.y + this.#padding.t;
    let w = this.container.w - this.#padding.l - this.#padding.r;
    if (w < 0) {
      w = 0;
    }
    let h = this.container.h - this.#padding.t - this.#padding.b;
    if (h < 0) {
      h = 0;
    }
    return {
      x, y, w, h,
    };
  }

  /**
   * Location on screen of the widget.
   */

  set container(val) {
    const onlyNumbers = (a) => a.every((i) => typeof i === 'number');

    if (Array.isArray(val) && val.length === 4 && onlyNumbers(val)) {
      if (
        this.#container.x !== val[0]
        || this.#container.y !== val[1]
        || this.#container.w !== val[2]
        || this.#container.h !== val[3]
      ) {
        this.#container = {
          x: val[0],
          y: val[1],
          w: val[2],
          h: val[3],
        };

        this._performLayout();
      }
    } else {
      throw Error('Widget container must be an array of four numbers');
    }
  }

  get container() {
    const w = this.fixedWidth === 0 ? this.#container.w : this.fixedWidth;
    const h = this.fixedHeight === 0 ? this.#container.h : this.fixedHeight;
    return {
      x: this.#container.x,
      y: this.#container.y,
      w,
      h,
    };
  }

  /**
   * If set this is the height of the widget. The widget will
   * not grow or shrink based on its container. If the widget
   * is larger than its container it will be clipped to fit in
   * the container
   */
  get fixedHeight() {
    if (this.#fixedHeight instanceof Widget) {
      return this.#fixedHeight.container.h;
    }
    return this.#fixedHeight;
  }

  /**
   * If set this is the height of the widget. The widget will
   * not grow or shrink based on its container. If the widget
   * is larger than its container it will be clipped to fit in
   * the container
   */
  set fixedHeight(val) {
    if (!Number.isNaN(Number(val)) && val < 0) {
      throw Error('Value number be a number greater than 0 or a Widget.');
    } else if (Number.isNaN(Number(val)) && !(val instanceof Widget)) {
      throw Error('Value number be a number greater than 0 or a Widget.');
    }

    if (this.#fixedHeight !== val) {
      this.#fixedHeight = val;
      if (this.#parent) {
        this.#parent._performLayout();
      } else {
        this._performLayout();
      }
    }
  }

  get fixedWidth() {
    if (this.#fixedWidth instanceof Widget) {
      return this.#fixedWidth.container.w;
    }
    return this.#fixedWidth;
  }

  set fixedWidth(val) {
    if (!Number.isNaN(Number(val)) && val < 0) {
      throw Error('Value number be a number greater than 0 or a Widget.');
    } else if (Number.isNaN(Number(val)) && !(val instanceof Widget)) {
      throw Error('Value number be a number greater than 0 or a Widget.');
    }

    if (this.#fixedWidth !== val) {
      this.#fixedWidth = val;
      if (this.#parent) {
        this.#parent._performLayout();
      } else {
        this._performLayout();
      }
    }
  }

  /**
   * If all items have in a container have grow set to 1, the remaining space in the container
   * will be distributed equally to all children. If one of the children has a value of 2, that
   * child would take up twice as much of the space either one of the others.
   * @type {number}
   */
  get grow() {
    return this.#grow;
  }

  /**
   * If all items have in a container have grow set to 1, the remaining space in the container
   * will be distributed equally to all children. If one of the children has a value of 2, that
   * child would take up twice as much of the space either one of the others.
   * @type {number}
   */
  set grow(val) {
    if (val < 1) {
      throw Error('Invalid widget grow value.');
    }
    this.#grow = val;
  }

  /**
   * By default, items are laid out in the source order. However, the order property controls the
   * order in which they appear in a container.
   * @type {number}
   */
  get order() {
    return this.#order;
  }

  /**
   * By default, items are laid out in the source order. However, the order property controls the
   * order in which they appear in a container.
   * @type {number}
   */
  set order(val) {
    if (val < 0) {
      throw Error('Invalid widget order value.');
    }
    this.#order = val;
  }

  // #endregion Position
  // #region Events

  set onMouseClick(val) {
    this._onMouseClick = null;
    if (typeof val === 'function') {
      this._onMouseClick = val;
    }
  }

  // #endregion

  _eventMouseMove(event) {
    this._mousePosX = event.x;
    this._mousePosY = event.y;
    if (
      this._mousePosX > this.container.x
      && this._mousePosX < this.container.x + this.container.w
      && this._mousePosY > this.container.y
      && this._mousePosY < this.container.y + this.container.h
    ) {
      this._mouseHover = true;
    } else {
      this._mouseHover = false;
    }
  }

  _eventMouseButtonDown() {
    if (
      this._mousePosX > this.container.x
      && this._mousePosX < this.container.x + this.container.w
      && this._mousePosY > this.container.y
      && this._mousePosY < this.container.y + this.container.h
    ) {
      this._mouseDown = true;
    } else {
      this._mouseDown = false;
    }
    return false;
  }

  _eventMouseButtonUp() {
    if (
      this._mousePosX > this.container.x
      && this._mousePosX < this.container.x + this.container.w
      && this._mousePosY > this.container.y
      && this._mousePosY < this.container.y + this.container.h
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

  // eslint-disable-next-line class-methods-use-this
  _performLayout() { }

  _logme(depth) {
    if (!Widget.#debug) {
      return;
    }
    // eslint-disable-next-line no-console
    console.log(`${'   '.repeat(depth)}${this.constructor.name} ${this.name} ${JSON.stringify(this.container)}`);
  }

  _preDraw() {
    if (this._mouseClick && this._onMouseClick !== null) {
      if (this._onMouseClick() === true) {
        let p = this.#parent;
        while (p !== null) {
          p._mouseClick = false;
          p = p.#parent;
        }
      }
    }
    this._mouseClick = false;
  }

  _draw(canvasCtx, depth) {
    if (this.constructor.name === 'Widget') {
      this._logme(depth);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  _postDraw() {
    // canvasCtx.beginPath();
    // canvasCtx.strokeStyle = this.#borderColor;
    // canvasCtx.rect(this.container.x, this.container.y, this.container.w, this.container.h);
    // canvasCtx.stroke();
  }

  draw(canvasCtx, depth = 0) {
    this._preDraw(canvasCtx, depth);
    this._draw(canvasCtx, depth);
    this._postDraw(canvasCtx, depth);
  }
}
