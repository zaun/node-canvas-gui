"use strict"

import crypto from 'crypto';
import Widget from './Widget.js';

export default class Label extends Widget {
  static #Fonts = {
    Sans: 'sans',
    Serif: 'serif',
    KenneyBlocks: 'Kenney_Blocks',
    KenneyFuture: 'Kenney_Future',
    KenneyFutureNarrow: 'Kenney_Future_Narrow',
    KenneyHigh: 'Kenney_High',
    KenneyHighSquare: 'Kenney_High_Square',
    KenneyMiniSquareMono: 'Kenney_Mini_Square_Mono',
    KenneyMiniSquare: 'Kenney_Mini_Square',
    KenneyMini: 'Kenney_Mini',
    KenneyPixelSquare: 'Kenney_Pixel_Square',
    KenneyPixel: 'Kenney_Pixel',
    KenneyRocketSquare: 'Kenney_Rocket_Square',
    KenneyRocket: 'Kenney_Rocket',
  };

  static get Fonts() {
    return Label.#Fonts;
  }

  #text = '';
  #font = 'sans';
  #size = 0;

  constructor(parent = null, name = crypto.randomUUID()) {
    super(parent, name);

    this.fontSize = 16;

    if (new.target === Label) {
      Object.preventExtensions(this)
    }
  }

  get text() {
    return this.#text;
  }

  get font() {
    return this.#font;
  }

  get fontSize() {
    return this.#size;
  }

  set text(val) {
    this.#text = val.toString();
  }

  set font(val) {
    this.#font = val;
  }

  set fontSize(val) {
    this.#size = val;
  }

  _draw(canvasCtx, depth = 0) {
    super._draw(canvasCtx, depth);

    if (this.constructor.name === 'Label') {
      this._logme(depth);
    }

    canvasCtx.save();
    canvasCtx.rect(this._container.x, this._container.y, this._container.w, this._container.h);
    canvasCtx.clip();

    canvasCtx.font = `${this.#size}px ${this.#font}`;
    const lines = this.#text.split('\n');

    let maxWidth = 0;
    for (var i = 0; i < lines.length; i++) {
      const lineWidth = canvasCtx.measureText(lines[i]).width;
      if (lineWidth > maxWidth) {
        maxWidth = lineWidth;
      }
    }

    const chInfo = canvasCtx.measureText('$');
    const lineHight = chInfo.emHeightAscent + chInfo.emHeightDescent + 2    

    const height = lines.length * lineHight;

    for (var i = 0; i < lines.length; i++) {
      let x = this._container.x + (this._container.w / 2) - (maxWidth / 2);
      if (x < this._container.x) {
        x = this._container.x;
      }
      let y = this._container.y + (this._container.h / 2) - (height / 2) + (i * lineHight) + (lineHight / 2);
      if (y < this._container.y) {
        y = this._container.y;
      }
      canvasCtx.fillText(lines[i], x, y);
    }
    
    canvasCtx.restore();
  }
}
