import crypto from 'crypto';
import Widget from './Widget.js';

export default class Container extends Widget {
  static #Orientation = {
    Horizontal: 0,
    Vertical: 1,
  };

  static get Orientation() {
    return this.#Orientation;
  }

  _orientation = Container.Orientation.Horizontal;
  #children = [];

  constructor(parent = null, name = crypto.randomUUID()) {
    super(parent, name);

    if (new.target === Container) {
      Object.preventExtensions(this);
    }
  }

  get children() {
    return this.#children;
  }

  get orientation() {
    return this._orientation;
  }

  set orientation(val) {
    if (!Object.values(Container.Orientation).includes(val)) {
      throw new Error('Invalid Orientation');
    }

    if (this._orientation !== val) {
      this._orientation = val;
      this._performLayout();
    }
  }

  _performLayout() {
    let childWidth = 0;
    let childHeight = 0;
    let fixed = 0;
    let childCount = 0;
    let offset = 0;

    switch (this.orientation) {
      case Container.Orientation.Horizontal:
        this.#children.forEach((w) => {
          if (!w._absolutePosition) {
            fixed += w.fixedWidth;
            if (w.fixedWidth === 0) {
              childCount += 1;
            }
          }
        });

        childWidth = Math.ceil((this.body.w - fixed) / childCount);
        childHeight = this.body.h;

        this.#children.forEach((w) => {
          if (!w._absolutePosition) {
            const newWidth = w.fixedWidth === 0 ? childWidth : w.fixedWidth;
            w.setContainer(this.body.x + offset, this.body.y, newWidth, childHeight);
            offset += newWidth;
          }
        });
        break;

      case Container.Orientation.Vertical:
        this.#children.forEach((w) => {
          fixed += w.fixedHeight;
          if (w.fixedHeight === 0) {
            childCount += 1;
          }
        });

        childWidth = this.body.w;
        childHeight = Math.ceil((this.body.h - fixed) / childCount);

        this.#children.forEach((w) => {
          const newHeight = w.fixedHeight === 0 ? childHeight : w.fixedHeight;
          w.setContainer(this.body.x, this.body.y + offset, childWidth, newHeight);
          offset += newHeight;
        });
        break;

      default:
        break;
    }
  }

  addChild(child) {
    this.#children.push(child);
    // eslint-disable-next-line no-param-reassign
    child._parent = this;
    this._performLayout();
  }

  removeChild(child) {
    this.#children = this.#children.filter((w) => w.name !== child.name);
    // eslint-disable-next-line no-param-reassign
    child.parent = null;
    this._performLayout();
  }

  removeChildren() {
    this.#children = [];
    this._performLayout();
  }

  _eventMouseMove(event) {
    this.#children.forEach((w) => {
      w._eventMouseMove(event);
    });
    super._eventMouseMove(event);
  }

  _eventMouseButtonDown(event) {
    let done = false;
    this.#children.forEach((w) => {
      if (!done) {
        done = w._eventMouseButtonDown(event);
      }
    });
    if (!done) {
      done = super._eventMouseButtonDown(event);
    }
    return done;
  }

  _eventMouseButtonUp(event) {
    let done = false;
    this.#children.forEach((w) => {
      if (!done && w._absolutePosition === true) {
        done = w._eventMouseButtonUp(event);
      }
    });
    this.#children.forEach((w) => {
      if (!done && w._absolutePosition !== true) {
        done = w._eventMouseButtonUp(event);
      }
    });
    if (!done) {
      done = super._eventMouseButtonUp(event);
    }
    return done;
  }

  _eventKeyDown(event) {
    let done = false;
    this.#children.forEach((w) => {
      if (!done) {
        done = w._eventKeyDown(event);
      }
    });
    if (!done) {
      done = super._eventKeyDown(event);
    }
    return done;
  }

  _eventMouseWheel(event) {
    let done = false;
    this.#children.forEach((w) => {
      if (!done) {
        done = w._eventMouseWheel(event);
      }
    });
    if (!done) {
      done = super._eventMouseWheel(event);
    }
    return done;
  }

  _preDraw(canvasCtx, depth) {
    super._preDraw(canvasCtx, depth);
    this.#children.forEach((w) => {
      w._preDraw(canvasCtx, depth + 1);
    });
  }

  _draw(canvasCtx, depth) {
    super._draw(canvasCtx, depth);
    if (this.constructor.name === 'Container') {
      this._logme(depth);
    }

    this.#children.forEach((w) => {
      w._draw(canvasCtx, depth + 1);
    });
  }

  _postDraw(canvasCtx, depth) {
    super._postDraw(canvasCtx, depth);
    this.#children.forEach((w) => {
      w._postDraw(canvasCtx, depth + 1);
    });
  }
}
