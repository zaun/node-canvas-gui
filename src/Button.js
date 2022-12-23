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

  #mode = Button.Mode.Default;

  #text = '';

  #fontSize = 0;
  #font = 'sans';

  #foregroundColor = '';
  #backgroundColor = '';
  #hoverForegroundColor = '';
  #hoverBackgroundColor = '';
  #hoverBorderColor = '';
  #view = null;

  constructor(parent = null, name = crypto.randomUUID()) {
    super(parent, name);

    this.setSize(Button.Size.Medium);
    this.setColor(Colors.Blue);

    if (new.target === Button) {
      Object.preventExtensions(this);
    }
  }

  set backgroundColor(val) {
    this.#backgroundColor = val;
    this._performLayout();
  }

  get backgroundColor() {
    return this.#backgroundColor;
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
    this.#foregroundColor = val;
    this._performLayout();
  }

  get foregroundColor() {
    return this.#foregroundColor;
  }

  set hoverBackgroundColor(val) {
    this.#hoverBackgroundColor = val;
    this._performLayout();
  }

  get hoverBackgroundColor() {
    return this.#hoverBackgroundColor;
  }

  set hoverBorderColor(val) {
    this.#hoverBorderColor = val;
    this._performLayout();
  }

  get hoverBorderColor() {
    return this.#hoverBorderColor;
  }

  set mode(val) {
    this.#mode = val;
    this._performLayout();
  }

  get mode() {
    return this.#mode;
  }

  set text(val) {
    this.#text = val;
    this._performLayout();
  }

  get text() {
    return this.#text;
  }

  get #calcBackground() {
    let backgroundColor = this.#backgroundColor;

    if (this._mouseHover) {
      backgroundColor = this.#hoverBackgroundColor;
    }

    return backgroundColor;
  }

  get #calcBorder() {
    let borderColor = this.#borderColor;

    if (this._mouseHover) {
      borderColor = this.#hoverBorderColor;
    }

    return borderColor;
  }

  get #calcForeground() {
    let foregroundColor = this.#foregroundColor;

    if (!this._mouseHover && this.mode === Button.Mode.Outline) {
      foregroundColor = this.#backgroundColor;
    }

    if (this._mouseHover && this.mode !== Button.Mode.Outline) {
      foregroundColor = this.#hoverForegroundColor;
    }

    if (this._mouseHover && this.mode === Button.Mode.Outline) {
      foregroundColor = this.#hoverBackgroundColor;
    }

    return foregroundColor;
  }

  setColor(val) {
    this.#backgroundColor = val;
    this.#borderColor = Colors.darker(val);
    this.#foregroundColor = Colors.foregroundFor(this.#backgroundColor);
    this.#hoverBackgroundColor = Colors.darker(val);
    this.#hoverBorderColor = Colors.darker(val);
    this.#hoverForegroundColor = Colors.foregroundFor(this.#hoverBackgroundColor);
    this._performLayout();
  }

  setSize(size) {
    switch (size) {
      case Button.Size.Large:
        this.fixedHeight = 48;
        this.fontSize = 20;
        this.radii = [8, 8, 8, 8];
        this.padding = [8, 8, 16, 16];
        break;
      case Button.Size.Medium:
        this.fixedHeight = 38;
        this.#fontSize = 16;
        this.radii = [6, 6, 6, 6];
        this.padding = [6, 6, 12, 12];
        break;
      case Button.Size.Small:
        this.fixedHeight = 31;
        this.fontSize = 14;
        this.radii = [4, 4, 4, 4];
        this.padding = [4, 4, 8, 8];
        break;
      default:
        throw Error('Invalid size');
    }
    this._performLayout();
  }

  _performLayout() {
    try {
      this.#view = Canvas.createCanvas(this.body.w, this.body.h);
      const viewCtx = this.#view.getContext('2d');

      viewCtx.fillStyle = this.#calcForeground;
      viewCtx.font = `${this.#fontSize}px ${this.#font}`;

      const chInfo = viewCtx.measureText(this.#text);
      let x = (this.body.w / 2) - (chInfo.width / 2);
      if (x < 0) {
        x = 0;
      }

      let y = this.body.h / 2;
      y += (chInfo.emHeightAscent / 2);
      y -= (chInfo.emHeightDescent / 2);

      viewCtx.clearRect(0, 0, this.body.w, this.body.h);
      viewCtx.fillText(this.#text, x, y);
    } catch (e) {
      // FIXME: I don't know why this is happening. It's like this
      //        function is being called with the wrong 'this' sometimes.
      // console.log(e);
      // console.log(this.name, this.constructor.name, this.text);
      // console.log(this.parent ? this.parent.name : '');
    }
  }

  _draw(canvasCtx, depth = 0) {
    if (this.constructor.name === 'Button') {
      this._logme(depth);
    }

    canvasCtx.beginPath();

    canvasCtx.lineWidth = this.#borderWidth;
    canvasCtx.fillStyle = this.#calcBackground;
    canvasCtx.strokeStyle = this.#calcBorder;

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
      this.#view,
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
