import crypto from 'crypto';
import Widget from './Widget.js';
import Container from './Container.js';
import Panel from './Panel.js';

// Force a fullscreen dialog that will prevent
// mouse clicks from propigating to items below it.
class ModalDialog extends Container {
  #modalRoot = new Container(null, 'ModalDialog Root');
  #modalCenter = new Container();
  #modalBody = new Panel(null, 'ModalDialog Body');

  /**
   * Create a new Widget.
   * @param {Widget} parent Assign a parent Widget during creation
   * @param {String} name Assign a name during creation
   */
  constructor(parent = null, name = crypto.randomUUID()) {
    super(parent, name);

    this.fixedSize = true;

    this.#modalRoot.container = [0, 0, global.window.width, global.window.height];
    this.#modalRoot.addChild(new Widget());
    this.#modalCenter.orientation = Container.Orientation.Vertical;
    this.#modalRoot.addChild(this.#modalCenter);
    this.#modalRoot.addChild(new Widget());

    this.#modalCenter.addChild(new Widget());
    this.#modalCenter.addChild(this.#modalBody);
    this.#modalCenter.addChild(new Widget());

    this.#modalBody.padding = [25, 25, 25, 25];

    this.#modalRoot.onMouseClick = () => true;
    this.onMouseClick = () => true;

    if (new.target === ModalDialog) {
      Object.preventExtensions(this);
    }
  }

  get fixedHeight() {
    return this.#modalBody.fixedHeight;
  }

  set fixedHeight(val) {
    this.#modalBody.fixedHeight = val;
  }

  get fixedWidth() {
    return this.#modalCenter.fixedWidth;
  }

  set fixedWidth(val) {
    this.#modalCenter.fixedWidth = val;
  }

  set onMouseClick(val) {
    this.#modalBody.onMouseClick = val;
  }

  set padding(val) {
    this.#modalBody.padding = val;
  }

  addChild(child) {
    this.#modalBody.addChild(child);
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

export default ModalDialog;
