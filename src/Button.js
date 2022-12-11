import Canvas from 'canvas';
import crypto from 'crypto';
import Colors from './Colors.js';
import Widget from './Widget.js';

export default class Button extends Widget {
  static Mode = {
    Default: 'Default',
    Outline: 'Outline',
    Link: 'Link',
  };

  static Size = {
    Large: 'Large',
    Medium: 'Medium',
    Small: 'Small',
  };

  #borderColor = '';
  #borderWidth = 4;

  #radii = [6, 6, 6, 6];

  _mode = Button.Mode.Default;

  _text = '';

  _fontSize = 0;
  _font = 'sans';

  _foregroundColor = '';
  _backgroundColor = '';
  _hoverForegroundColor = '';
  _hoverBackgroundColor = '';
  _hoverBorderColor = '';
  _view = null;

  constructor(parent = null, name = crypto.randomUUID()) {
    super(parent, name);

    this.setSize(Button.Size.Medium);
    this.setColor(Colors.Blue);

    if (new.target === Button) {
      Object.preventExtensions(this);
    }
  }

  set backgroundColor(val) {
    this._backgroundColor = val;
    this._performLayout();
  }

  get backgroundColor() {
    return this._backgroundColor;
  }

  set borderColor(val) {
    this._borderColor = val;
    this._performLayout();
  }

  get borderColor() {
    return this._borderColor;
  }

  set borderWidth(val) {
    this.#borderWidth = val * 4;
  }

  get borderWidth() {
    return this.#borderWidth / 4;
  }

  set foregroundColor(val) {
    this._foregroundColor = val;
    this._performLayout();
  }

  get foregroundColor() {
    return this._foregroundColor;
  }

  set hoverBackgroundColor(val) {
    this._hoverBackgroundColor = val;
    this._performLayout();
  }

  get hoverBackgroundColor() {
    return this._hoverBackgroundColor;
  }

  set hoverBorderColor(val) {
    this._hoverBorderColor = val;
    this._performLayout();
  }

  get hoverBorderColor() {
    return this._hoverBorderColor;
  }

  set mode(val) {
    this._mode = val;
    this._performLayout();
  }

  get mode() {
    return this._mode;
  }

  set text(val) {
    this._text = val;
    this._performLayout();
  }

  get text() {
    return this._text;
  }

  get _calcBackground() {
    let backgroundColor = this._backgroundColor;

    if (this._mouseHover) {
      backgroundColor = this._hoverBackgroundColor;
    }

    return backgroundColor;
  }

  get _calcBorder() {
    let borderColor = this.#borderColor;

    if (this._mouseHover) {
      borderColor = this._hoverBorderColor;
    }

    return borderColor;
  }

  get _calcForeground() {
    let foregroundColor = this._foregroundColor;

    if (!this._mouseHover && this.mode === Button.Mode.Outline) {
      foregroundColor = this._backgroundColor;
    }

    if (this._mouseHover && this.mode !== Button.Mode.Outline) {
      foregroundColor = this._hoverForegroundColor;
    }

    if (this._mouseHover && this.mode === Button.Mode.Outline) {
      foregroundColor = this._hoverBackgroundColor;
    }

    return foregroundColor;
  }

  setColor(val) {
    this._backgroundColor = val;
    this.#borderColor = Colors.darker(val);
    this._foregroundColor = Colors.foregroundFor(this._backgroundColor);
    this._hoverBackgroundColor = Colors.darker(val);
    this._hoverBorderColor = Colors.darker(val);
    this._hoverForegroundColor = Colors.foregroundFor(this._hoverBackgroundColor);
  }

  setSize(size) {
    switch (size) {
      case Button.Size.Large:
        this.fixedHeight = 48;
        this._fontSize = 20;
        this.#radii = [8, 8, 8, 8];
        this.setPadding(8, 8, 16, 16);
        break;
      case Button.Size.Medium:
        this.fixedHeight = 38;
        this._fontSize = 16;
        this.#radii = [6, 6, 6, 6];
        this.setPadding(6, 6, 12, 12);
        break;
      case Button.Size.Small:
        this.fixedHeight = 31;
        this._fontSize = 14;
        this.#radii = [4, 4, 4, 4];
        this.setPadding(4, 4, 8, 8);
        break;
      default:
        throw Error('Invalid size');
    }
  }

  _performLayout() {
    this._view = Canvas.createCanvas(this.body.w, this.body.h);
    const viewCtx = this._view.getContext('2d');

    viewCtx.fillStyle = this._calcForeground;
    viewCtx.font = `${this._fontSize}px ${this._font}`;

    const chInfo = viewCtx.measureText(this._text);
    let x = this.body.x + (this.body.w / 2) - (chInfo.width / 2);
    if (x < this.body.x) {
      x = this.body.x;
    }

    let y = this.body.y + (this.body.h / 2);
    y += (chInfo.emHeightAscent / 2);
    y -= (chInfo.emHeightDescent / 2);

    viewCtx.fillStyle = this._calcForeground;
    viewCtx.font = `${this._fontSize}px ${this._font}`;

    viewCtx.clearRect(0, 0, this.body.w, this.body.h);
    viewCtx.fillText(this._text, x - this.body.x, y - this.body.y);
  }

  _draw(canvasCtx, depth = 0) {
    if (this.constructor.name === 'Button') {
      this._logme(depth);
    }

    canvasCtx.beginPath();

    canvasCtx.lineWidth = this.#borderWidth;
    canvasCtx.fillStyle = this._calcBackground;
    canvasCtx.strokeStyle = this._calcBorder;

    canvasCtx.roundRect(
      this.container.x + (canvasCtx.lineWidth / 2),
      this.container.y + (canvasCtx.lineWidth / 2),
      this.container.w - canvasCtx.lineWidth,
      this.container.h - canvasCtx.lineWidth,
      this.#radii,
    );

    if (this.mode === Button.Mode.Default || this.mode === Button.Mode.Outline) {
      canvasCtx.stroke();
    }

    if (this.mode === Button.Mode.Default) {
      canvasCtx.fill();
    }

    canvasCtx.drawImage(
      this._view,
      0,
      0,
      this.body.w,
      this.body.h,
      this.body.x,
      this.body.y,
      this.body.w,
      this.body.h,
    );

    super._draw(canvasCtx, depth);
  }
}
