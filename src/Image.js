import crypto from 'crypto';
import { loadImage } from 'canvas';
import Widget from './Widget.js';

/**
 * The Image widget displays an image. The supported image types
 * are any supported by the node-canvas loadImage function.
 * @extends Widget
 */
class Image extends Widget {
  static #Mode = {
    Cover: 0,
    ScaleToFill: 1,
  };

  static get Mode() {
    return this.#Mode;
  }

  static {
    Object.preventExtensions(this.#Mode);
  }

  #src = '';
  #image = null;
  #loading = false;
  #loadingWidget = null;
  #mode = Image.Mode.ScaleToFill;

  /**
   * Create a new Image.
   * @param {Widget} parent Assign a parent Widget during creation
   * @param {String} name Assign a name during creation
   */
  constructor(parent = null, name = crypto.randomUUID()) {
    super(parent, name);

    if (new.target === Image) {
      Object.preventExtensions(this);
    }
  }

  get loading() {
    return this.#loading;
  }

  get src() {
    return this.#src;
  }

  set src(val) {
    this.#src = val;
    this.#updateImage();
  }

  get loadingWidget() {
    return this.#loadingWidget;
  }

  set loadingWidget(val) {
    this.#loadingWidget = val;
  }

  get mode() {
    return this.#mode;
  }

  set mode(val) {
    if (!Object.values(Image.Mode).includes(val)) {
      throw new Error('Invalid Mode');
    }
    this.#mode = val;
  }

  #updateImage() {
    this.#loading = true;
    this.#image = null;
    loadImage(this.#src)
      .then((image) => {
        this.#image = image;
      })
      .finally(() => {
        this.#loading = false;
      });
  }

  _draw(canvasCtx, depth = 0) {
    super._draw(canvasCtx, depth);
    if (this.constructor.name === 'Image') {
      this._logme(depth);
    }

    if (this.#loading && this.#loadingWidget === null) {
      return;
    }

    if (this.#loading) {
      this.#loadingWidget.container = [this.body.x, this.body.y, this.body.w, this.body.h];
      this.#loadingWidget.draw(canvasCtx, depth + 1);
      return;
    }

    if (this.#image === null) {
      return;
    }

    if (this.mode === Image.Mode.ScaleToFill) {
      const hRatio = this.body.w / this.body.h;
      const vRatio = this.body.h / this.body.w;
      const ratio = Math.min(hRatio, vRatio);
      const offsetX = (this.body.w - this.#image.width * ratio) / 2;
      const offsetY = (this.body.h - this.#image.height * ratio) / 2;

      canvasCtx.drawImage(
        this.#image,
        0,
        0,
        this.#image.width,
        this.#image.height,
        this.body.x + offsetX,
        this.body.y + offsetY,
        this.#image.width * ratio,
        this.#image.height * ratio,
      );
    } else if (this.mode === Image.Mode.Cover) {
      canvasCtx.drawImage(
        this.#image,
        this.body.x,
        this.body.y,
        this.body.w,
        this.body.h,
      );
    }
  }
}

export default Image;
