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
  #foreground = '';

  constructor(parent = null, name = crypto.randomUUID()) {
    super(parent, name);

    this.fontSize = 16;

    if (new.target === Label) {
      Object.preventExtensions(this);
    }
  }

  get text() {
    return this.#text;
  }

  set text(val) {
    this.#text = val.toString();
  }

  get font() {
    return this.#font;
  }

  set font(val) {
    this.#font = val;
  }

  get fontSize() {
    return this.#size;
  }

  set fontSize(val) {
    this.#size = val;
  }

  get foreground() {
    return this.#foreground;
  }

  set foreground(val) {
    this.#foreground = val;
  }

  _draw(canvasCtx, depth = 0) {
    super._draw(canvasCtx, depth);

    if (this.constructor.name === 'Label') {
      this._logme(depth);
    }

    canvasCtx.save();
    canvasCtx.rect(this.container.x, this.container.y, this.container.w, this.container.h);
    canvasCtx.clip();

    canvasCtx.font = `${this.#size}px ${this.#font}`;
    canvasCtx.fillStyle = this.#foreground === '' ? this.theme.colors.foreground : this.#foreground;
    const lines = this.#text.split('\n');

    let maxWidth = 0;
    for (let i = 0; i < lines.length; i += 1) {
      const lineWidth = canvasCtx.measureText(lines[i]).width;
      if (lineWidth > maxWidth) {
        maxWidth = lineWidth;
      }
    }

    const chInfo = canvasCtx.measureText('$');
    const lineHight = chInfo.emHeightAscent + chInfo.emHeightDescent + 2;

    const height = lines.length * lineHight;

    for (let i = 0; i < lines.length; i += 1) {
      let x = this.container.x + (this.container.w / 2) - (maxWidth / 2);
      if (x < this.container.x) {
        x = this.container.x;
      }

      let y = this.container.y + (this.container.h / 2);
      y = y - (height / 2) + (i * lineHight) + (lineHight / 2);
      if (y < this.container.y) {
        y = this.container.y;
      }

      canvasCtx.fillText(lines[i], x, y);
    }

    canvasCtx.restore();
  }
}
