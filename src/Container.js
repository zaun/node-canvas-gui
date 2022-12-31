import crypto from 'crypto';
import Widget from './Widget.js';

/**
 * A canvas-gui user interface is constructed by nesting widgets inside widgets. Container
 * widgets are the inner nodes in the resulting tree of widgets: they contain other widgets.
 * So, for example, you might have a Container containing a Panel containing a Label. If you
 * wanted an image instead of a textual label inside the Panel, you might replace the Label
 * widget with a Image widget.
 * @extends Widget
 */
class Container extends Widget {
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

  static {
    Object.preventExtensions(this.#Orientation);
    Object.preventExtensions(this.#AlignItems);
    Object.preventExtensions(this.#JustifyItems);
  }

  _orientation = Container.Orientation.Horizontal;
  #children = [];
  #spacing = 5;
  #alignItems = Container.AlignItems.Center;
  #justifyItems = Container.JustifyItems.Start;
  #autoHeight = false;

  /**
   * Create a new Container.
   * @param {Widget} parent Assign a parent Widget during creation
   * @param {String} name Assign a name during creation
   */
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
    if (!Object.values(Container.AlignItems).includes(val)) {
      throw new Error('Invalid AlignItems');
    }

    if (this.#alignItems !== val) {
      this.#alignItems = val;
      this._performLayout();
    }
  }

  get justifyItems() {
    return this.#justifyItems;
  }

  /**
   * @type {JustifyItems}
   */
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

  /**
   * Number of pixels spaced between each child
   * @type {Number}
   */
  set spacing(val) {
    if (Number.isNaN(Number(val)) || val < 0) {
      throw new Error('Value must be a number greater than 0 or a Widget.');
    }

    this.#spacing = val;
    this._performLayout();
  }

  get autoHeight() {
    return this.#autoHeight;
  }

  /**
   * When true automatically set the widget height to the size
   * of the content. All child widgets must had a fixedHieght
   * set or have autoHeight set. When false widget will be
   * sized by it's parent.
   * @type {Boolean}
   */
  set autoHeight(val) {
    if (typeof val !== 'boolean') {
      throw new Error('Value must be Boolean');
    }

    // If changing from fixed to unfixed then clear the
    // current fixedHeight and update everything.
    if (this.#autoHeight && !val) {
      this.#autoHeight = val;
      this.fixedHeight = 0;
    } else {
      this.#autoHeight = val;
      this._performLayout();
    }
  }

  /**
   * Return child widgets sorted by the widget's order
   * @private
   */
  get #sortedChildren() {
    return this.#children.sort((a, b) => {
      if (a.order > b.order) {
        return 1;
      }
      if (a.order < b.order) {
        return -1;
      }
      return 0;
    });
  }

  /**
   * Update each child widget's container based on
   * the currently selected configuration.
   * @private
   */
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
    let totalHeight = 0;

    switch (this.orientation) {
      case Container.Orientation.Horizontal:
        if (this.#children.length === 0) {
          return;
        }
        if (this.body.w === 0) {
          return;
        }

        // Exclude absolutely positioned children and
        // and children without a fixedHeight if Container is set to autoHeight
        children = this.#sortedChildren
          .filter((i) => i._absolutePosition === false)
          .filter((i) => !this.autoHeight || (this.autoHeight && i.fixedHeight !== 0));

        children.forEach((w) => {
          fixed += w.fixedWidth;
          childCount += 1;
          if (w.fixedWidth === 0) {
            gridCount += w.grow;
          }

          if (this.#autoHeight) {
            totalHeight += w.fixedHeight;
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

        if (this.#autoHeight && this.fixedHeight !== totalHeight) {
          this.fixedHeight = totalHeight + this.padding.t + this.padding.b;
          if (this.parent) {
            this.parent._performLayout();
          } else {
            this._performLayout();
          }
        }
        break;

      case Container.Orientation.Vertical:
        if (this.#children.length === 0) {
          return;
        }
        if (this.body.h === 0 && !this.autoHeight) {
          return;
        }

        // Exclude absolutely positioned children and
        // and children without a fixedHeight if Container is set to autoHeight
        children = this.#sortedChildren
          .filter((i) => i._absolutePosition === false)
          .filter((i) => !this.autoHeight || (this.autoHeight && i.fixedHeight !== 0));

        children.forEach((w) => {
          fixed += w.fixedHeight;
          childCount += 1;
          if (w.fixedHeight === 0) {
            gridCount += w.grow;
          }

          if (this.#autoHeight) {
            totalHeight += w.fixedHeight;
          }
        });

        totalSpacing = (this.#spacing * (childCount - 1));
        if (totalSpacing < 0) {
          totalSpacing = 0;
        }
        if (this.#autoHeight) {
          totalHeight += totalSpacing;
        }

        if (gridCount > 0) {
          childHeight = Math.floor((this.body.h - fixed - totalSpacing) / gridCount);
          if (childHeight < 0) {
            childHeight = 0;
          }
        }
        childWidth = this.body.w;

        children.forEach((w) => {
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

        if (this.#autoHeight && this.fixedHeight !== totalHeight) {
          this.fixedHeight = totalHeight + this.padding.t + this.padding.b;
          if (this.parent) {
            this.parent._performLayout();
          } else {
            this._performLayout();
          }
        }
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
    if (!this.#children.find((w) => w.name === child.name)) {
      return;
    }

    this.#children = this.#children.filter((w) => w.name !== child.name);
    // eslint-disable-next-line no-param-reassign
    child.parent = null;
    this._performLayout();
  }

  removeChildren() {
    this.#children.forEach((w) => {
      // eslint-disable-next-line no-param-reassign
      w.parent = null;
    });
  }

  _eventMouseMove(event) {
    this.#sortedChildren.forEach((w) => {
      w._eventMouseMove(event);
    });
    super._eventMouseMove(event);
  }

  _eventMouseButtonDown(event) {
    this.#sortedChildren.forEach((w) => {
      w._eventMouseButtonDown(event);
    });
    super._eventMouseButtonDown(event);
  }

  _eventMouseButtonUp(event) {
    this.#sortedChildren.forEach((w) => {
      w._eventMouseButtonUp(event);
    });
    super._eventMouseButtonUp(event);
  }

  _eventKeyDown(event) {
    this.#sortedChildren.forEach((w) => {
      w._eventKeyDown(event);
    });
    super._eventKeyDown(event);
  }

  _eventMouseWheel(event) {
    this.#sortedChildren.forEach((w) => {
      w._eventMouseWheel(event);
    });
    super._eventMouseWheel(event);
  }

  /**
   * Handle mouse click for the Container and all it's children
   */
  _preDraw() {
    this.#sortedChildren.slice().reverse().forEach((w) => {
      w._preDraw();
    });
    super._preDraw();
  }

  _draw(canvasCtx, depth) {
    if (this.constructor.name === 'Container') {
      this._logme(depth);
    }

    this.#sortedChildren.forEach((w) => {
      w._draw(canvasCtx, depth + 1);
    });
  }

  _postDraw(canvasCtx, depth) {
    this.#sortedChildren.forEach((w) => {
      w._postDraw(canvasCtx, depth + 1);
      // canvasCtx.strokeStyle = '#333333';
      // canvasCtx.strokeRect(w.container.x, w.container.y, w.container.w, w.container.h);
    });
  }
}

export default Container;
