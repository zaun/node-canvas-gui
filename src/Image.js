import crypto from 'crypto';
import { loadImage } from 'canvas';
import Widget from './Widget.js';

/**
 * The Image widget displays an image. The supported image types
 * are any supported by the node-canvas loadImage function.
 * @extends Widget
 */
class Image extends Widget {
  #src = '';
  #image = null;
  #loading = false;

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

    if (!this.#loading) {
      canvasCtx.drawImage(
        this.#image,
        this.container.x,
        this.container.y,
        this.container.w,
        this.container.h,
      );
    }
  }
}

export default Image;
