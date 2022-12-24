import crypto from 'crypto';
import Widget from './Widget.js';

export default class Container extends Widget {
  static #Orientation = {
    Horizontal: 0,
    Vertical: 1,
  };

  static #AlignItems = {
    Start: 0,
    Center: 1,
    End: 2,
  };

  static #JustifyItems = {
    Start: 0,
    Center: 1,
    End: 2,
    Between: 3,
    Around: 4,
  };

  static get Orientation() {
    return this.#Orientation;
  }

  static get AlignItems() {
    return this.#AlignItems;
  }

  static get JustifyItems() {
    return this.#JustifyItems;
  }

  _orientation = Container.Orientation.Horizontal;
  #children = [];
  #spacing = 5;
  #alignItems = Container.AlignItems.Center;
  #justifyItems = Container.JustifyItems.Start;

  constructor(parent = null, name = crypto.randomUUID()) {
    super(parent, name);

    if (new.target === Container && !Widget.testing) {
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

  get alignItems() {
    return this.#alignItems;
  }

  set alignItems(val) {
    if (!Object.values(Container.AlighItems).includes(val)) {
      throw new Error('Invalid AlighItems');
    }

    if (this.#alignItems !== val) {
      this.#alignItems = val;
      this._performLayout();
    }
  }

  get justifyItems() {
    return this.#justifyItems;
  }

  set justifyItems(val) {
    if (!Object.values(Container.JustifyItems).includes(val)) {
      throw new Error('Invalid JustifyItems');
    }

    if (this.#justifyItems !== val) {
      this.#justifyItems = val;
      this._performLayout();
    }
  }

  get spacing() {
    return this.#spacing;
  }

  set spacing(val) {
    this.#spacing = val;
    this._performLayout();
  }

  _performLayout() {
    let totalSpacing = 0;
    let childWidth = 0;
    let childHeight = 0;
    let fixed = 0;
    let childCount = 0;
    let gridCount = 0;
    let offset = 0;
    let children = [];
    let totalItemWidth = 0;

    switch (this.orientation) {
      case Container.Orientation.Horizontal:
        if (this.#children.length === 0) {
          return;
        }
        if (this.body.w === 0) {
          return;
        }

        children = this.#children.sort((a, b) => {
          if (a.order > b.order) {
            return 1;
          }
          if (a.order < b.order) {
            return -1;
          }
          return 0;
        });

        children.forEach((w) => {
          fixed += w.fixedWidth;
          childCount += 1;
          if (w.fixedWidth === 0) {
            gridCount += w.grow;
          }
        });

        totalSpacing = (this.#spacing * (childCount - 1));
        if (totalSpacing < 0) {
          totalSpacing = 0;
        }

        if (gridCount > 0) {
          childWidth = Math.floor((this.body.w - fixed - totalSpacing) / gridCount);
          if (childWidth < 0) {
            childWidth = 0;
          }
        }
        childHeight = this.body.h;

        children.forEach((w) => {
          const itemWidth = Math.floor(w.fixedWidth === 0 ? w.grow * childWidth : w.fixedWidth);
          totalItemWidth += itemWidth + this.#spacing;
        });
        totalItemWidth -= this.#spacing;

        children.forEach((w, idx) => {
          let { x } = this.body;
          let { y } = this.body;

          if (w.fixedHeight) {
            if (this.body.h > w.container.h
              && this.#alignItems === Container.AlignItems.Center) {
              y += (this.body.h - w.container.h) / 2;
            } else if (this.#alignItems === Container.AlignItems.End) {
              y += (this.body.h - w.container.h);
            }
          }

          const extraSpace = this.body.w - totalItemWidth;
          if (this.#justifyItems === Container.JustifyItems.Center) {
            x += extraSpace / 2;
          } else if (this.#justifyItems === Container.JustifyItems.End) {
            x += extraSpace;
          } else if (this.#justifyItems === Container.JustifyItems.Between) {
            if (idx < children.length) {
              x += (extraSpace / (children.length - 1)) * idx;
            }
          } else if (this.#justifyItems === Container.JustifyItems.Around) {
            x += (extraSpace / (children.length + 1)) * (idx + 1);
          }

          const newWidth = w.fixedWidth === 0 ? w.grow * childWidth : w.fixedWidth;
          // eslint-disable-next-line no-param-reassign
          w.container = [x + offset, y, newWidth, childHeight];
          offset += newWidth + this.#spacing;
        });
        break;

      case Container.Orientation.Vertical:
        if (this.#children.length === 0) {
          return;
        }
        if (this.body.h === 0) {
          return;
        }

        children = this.#children.sort((a, b) => {
          if (a.order > b.order) {
            return 1;
          }
          if (a.order < b.order) {
            return -1;
          }
          return 0;
        });

        children.forEach((w) => {
          fixed += w.fixedHeight;
          childCount += 1;
          if (w.fixedWidth === 0) {
            gridCount += w.grow;
          }
        });

        totalSpacing = (this.#spacing * (childCount - 1));
        if (totalSpacing < 0) {
          totalSpacing = 0;
        }

        if (gridCount > 0) {
          childHeight = Math.floor((this.body.h - fixed - totalSpacing) / gridCount);
          if (childHeight < 0) {
            childHeight = 0;
          }
        }
        childWidth = this.body.w;

        this.#children.forEach((w) => {
          let { x } = this.body;
          const { y } = this.body;

          if (w.fixedWidth) {
            if (this.body.w > w.container.w
              && this.#alignItems === Container.AlignItems.Center) {
              x += (this.container.w - w.container.w) / 2;
            } else if (this.#alignItems === Container.AlignItems.End) {
              x += (this.container.w - w.container.w);
            }
          }

          if (w.fixedHeight === 0) {
            const newHeight = w.grow * childHeight;
            // eslint-disable-next-line no-param-reassign
            w.container = [x, y + offset, childWidth, newHeight];
            offset += newHeight + this.#spacing;
          } else {
            // eslint-disable-next-line no-param-reassign
            w.container = [x, y + offset, childWidth, w.fixedHeight];
            offset += w.fixedHeight + this.#spacing;
          }
        });
        break;

      default:
        break;
    }
  }

  addChild(child) {
    if (this.#children.find((w) => w.name === child.name)) {
      return;
    }

    this.#children.push(child);
    // eslint-disable-next-line no-param-reassign
    child.parent = this;
    this._performLayout();
  }

  removeChild(child) {
    if (!this.#children.find((w) => w.name !== child.name)) {
      return;
    }

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
      if (!done && w.fixedSize === true) {
        done = w._eventMouseButtonUp(event);
      }
    });
    this.#children.forEach((w) => {
      if (!done && w.fixedSize !== true) {
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
    this.#children.forEach((w) => {
      w._preDraw(canvasCtx, depth + 1);
    });
    super._preDraw(canvasCtx, depth);
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
      // canvasCtx.strokeStyle = '#333333';
      // canvasCtx.strokeRect(w.container.x, w.container.y, w.container.w, w.container.h);
    });
  }
}
