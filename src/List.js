import Canvas from 'canvas';
import crypto from 'crypto';
import Widget from './Widget.js';

/**
 * A List is a vertical container that contains Widget children.
 * @extends Widget
 */
class List extends Widget {
  #items = [];
  #itemHeight = 1;
  #itemWidgets = [];
  #itemCreate = null;

  #view = null;
  #scroll = 0;
  #cols = 1;

  #spacing = 5;

  /**
   * Create a new List.
   * @param {Widget} parent Assign a parent Widget during creation
   * @param {String} name Assign a name during creation
   */
  constructor(parent = null, name = crypto.randomUUID()) {
    super(parent, name);

    this.#itemCreate = this.#emptyItemCreate;

    if (new.target === List) {
      Object.preventExtensions(this);
    }
  }

  get cols() {
    return this.#cols;
  }

  set cols(val) {
    if (Number.isNaN(Number(val)) || val < 1) {
      throw new Error('Value must be a number greater or equal to 1.');
    }

    this.#cols = val;
    this._performLayout();
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

  get spacing() {
    return this.#spacing;
  }

  set spacing(val) {
    this.#spacing = val;
    this._performLayout();
  }

  get #maxScroll() {
    const rowCount = Math.ceil(this.#items.length / this.#cols);
    const itemsHeight = rowCount * (this.#itemHeight + this.spacing) - this.spacing;
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

    const rowCount = Math.ceil(this.#items.length / this.#cols);
    let viewHeight = ((this.#itemHeight + this.spacing) * rowCount) - this.spacing;
    if (viewHeight < 0) {
      viewHeight = 0;
    }

    this.#view = Canvas.createCanvas(this.body.w, viewHeight);

    const totalSpaceing = this.spacing * (this.#cols - 1);
    const itemWidth = ((this.body.w - totalSpaceing) / this.#cols);
    let itemY = 0;
    this.#items.forEach((i, idx) => {
      const col = (idx % this.#cols);
      const itemX = col * itemWidth;

      const w = this.#itemCreate(i);
      w.container = [itemX + (col * this.spacing), itemY, itemWidth, this.#itemHeight];

      this.#itemWidgets.push(w);

      if (col === this.#cols - 1) {
        itemY += this.#itemHeight + this.spacing;
      }
    });

    this.#updateView();

    if (this.#maxScroll === 0) {
      this.#scroll = 0;
    }
  }

  #updateView() {
    const viewCtx = this.#view.getContext('2d');

    viewCtx.clearRect(0, 0, this.#view.width, this.#view.height);
    this.#itemWidgets.forEach((w) => {
      w.draw(viewCtx);
    });
  }

  _eventMouseMove(event) {
    this.#itemWidgets.forEach((w) => {
      w._eventMouseMove({
        x: event.x - this.body.x,
        y: event.y - this.body.y + this.#scroll,
      });
    });
    super._eventMouseMove(event);
  }

  _eventMouseButtonDown(event) {
    this.#itemWidgets.forEach((w) => {
      w._eventMouseButtonDown(event);
    });
    super._eventMouseButtonDown(event);
  }

  _eventMouseButtonUp(event) {
    this.#itemWidgets.forEach((w) => {
      w._eventMouseButtonUp(event);
    });
    super._eventMouseButtonUp(event);
  }

  _eventKeyDown(event) {
    this.#itemWidgets.forEach((w) => {
      w._eventKeyDown(event);
    });
    super._eventKeyDown(event);
  }

  _preDraw() {
    this.#updateView();
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

export default List;
