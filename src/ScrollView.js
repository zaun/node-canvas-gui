import Canvas from 'canvas';
import crypto from 'crypto';
import Widget from './Widget.js';

/**
 * The Label widget displays a small amount of text.
 * @extends Widget
 */
class ScrollView extends Widget {
  #view = null;
  #child = null;
  #scroll = 0;

  /**
   * Create a new Label.
   * @param {Widget} parent Assign a parent Widget during creation
   * @param {String} name Assign a name during creation
   */
  constructor(parent = null, name = crypto.randomUUID()) {
    super(parent, name);

    this.padding = 3;

    if (new.target === ScrollView) {
      Object.preventExtensions(this);
    }
  }

  get child() {
    return this.#child;
  }

  set child(val) {
    if (val instanceof Widget !== true) {
      throw Error('Must be a Widget');
    }

    this.#child = val;
    this._performLayout();
  }

  get #maxScroll() {
    if (this.#view === null) {
      return 0;
    }

    if (this.#view.height > this.body.h) {
      return this.#view.height - this.body.h;
    }

    return 0;
  }

  _performLayout() {
    if (this.#child === null) {
      return;
    }

    this.#child.container = [
      0,
      0,
      this.body.w,
      this.body.h,
    ];

    this.#child._performLayout();

    this.#view = Canvas.createCanvas(this.#child.container.w, this.#child.container.h);

    this.#updateView();
  }

  #updateView(depth = 0) {
    const viewCtx = this.#view.getContext('2d');

    viewCtx.clearRect(0, 0, this.#view.width, this.#view.height);
    this.#child.draw(viewCtx, depth);
  }

  _eventMouseMove(event) {
    this.#child._eventMouseMove({
      x: event.x - this.body.x,
      y: event.y - this.body.y + this.#scroll,
    });
    super._eventMouseMove(event);
  }

  _eventMouseButtonDown(event) {
    this.#child._eventMouseButtonDown(event);
    super._eventMouseButtonDown(event);
  }

  _eventMouseButtonUp(event) {
    this.#child._eventMouseButtonUp(event);
    super._eventMouseButtonUp(event);
  }

  _eventKeyDown(event) {
    this.#child._eventKeyDown(event);
    super._eventKeyDown(event);
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

  /**
   * Handle mouse click for the Container and all it's children
   */

  _draw(canvasCtx, depth) {
    if (this.constructor.name === 'ScrollView') {
      this._logme(depth);
    }

    this.#updateView(depth + 1);

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
  }
}

export default ScrollView;
