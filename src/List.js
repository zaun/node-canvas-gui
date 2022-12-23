import Canvas from 'canvas';
import crypto from 'crypto';
import Widget from './Widget.js';

export default class List extends Widget {
  #items = [];
  #itemHeight = 1;
  #itemWidgets = [];
  // eslint-disable-next-line class-methods-use-this
  #itemCreate = null;

  #view = null;
  #scroll = 0;

  constructor(parent = null, name = crypto.randomUUID()) {
    super(parent, name);

    this.#itemCreate = this.#emptyItemCreate;

    if (new.target === List) {
      Object.preventExtensions(this);
    }
  }

  get items() {
    return this.#items;
  }

  set items(val) {
    this.#items = val;
    this._performLayout();
  }

  get itemHeight() {
    return this.#itemHeight;
  }

  set itemHeight(val) {
    this.#itemHeight = val;
    this._performLayout();
  }

  set itemCreate(fn) {
    if (typeof fn !== 'function') {
      throw new Error('itemCreate must be a function that returns a widget');
    }

    this.#itemCreate = fn;
    this._performLayout();
  }

  get #maxScroll() {
    const itemsHeight = this.#items.length * this.#itemHeight;
    if (itemsHeight > this.body.h) {
      return itemsHeight - this.body.h;
    }
    return 0;
  }

  #emptyItemCreate() {
    const w = new Widget();
    w.fixedHeight = this.itemHeight;

    return w;
  }

  _eventMouseWheel({ x, y, dy }) {
    if (
      x >= this.body.x && x <= this.body.x + this.body.w
      && y >= this.body.y && y <= this.body.y + this.body.h
    ) {
      if (this.#maxScroll === 0) {
        this.#scroll = 0;
        return;
      }

      this.#scroll += dy * 10;
      if (this.#scroll < 0) {
        this.#scroll = 0;
      }

      if (this.#scroll > this.#maxScroll && this.#maxScroll > 0) {
        this.#scroll = this.#maxScroll;
      }
    }
  }

  _performLayout() {
    this.#itemWidgets = [];
    this.#view = Canvas.createCanvas(this.body.w, this.#itemHeight * this.#items.length);
    const viewCtx = this.#view.getContext('2d');

    this.#items.forEach((i, idx) => {
      const w = this.#itemCreate(i);
      w.container = [0, idx * this.#itemHeight, this.body.w, this.#itemHeight];
      w.draw(viewCtx);
      this.#itemWidgets.push(w);
    });

    if (this.#maxScroll === 0) {
      this.#scroll = 0;
    }
  }

  _draw(canvasCtx, depth = 0) {
    if (this.constructor.name === 'List') {
      this._logme(depth);
    }

    canvasCtx.drawImage(
      this.#view,
      0,
      this.#scroll,
      this.body.w,
      this.body.h,
      this.body.x,
      this.body.y,
      this.body.w,
      this.body.h,
    );

    super._draw(canvasCtx, depth);
  }
}
