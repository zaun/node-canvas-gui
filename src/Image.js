import crypto from 'crypto';
import { loadImage } from 'canvas';
import Widget from './Widget.js';

export default class Image extends Widget {
  #src = '';
  #image = null;
  #loading = false;

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
