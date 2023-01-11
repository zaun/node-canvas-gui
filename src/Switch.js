import Canvas from 'canvas';
import crypto from 'crypto';
import Colors from './Colors.js';
import Widget from './Widget.js';

/**
 * The Button widget is generally used to trigger a callback function that is
 * called when the button is pressed.
 * @extends Widget
 */
class Button extends Widget {
  static Size = {
    Large: 'Large',
    Medium: 'Medium',
    Small: 'Small',
  };

  #borderColor = '';
  #borderWidth = 4;

  #radii = [6, 6, 6, 6];

  #value = true;

  #fontSize = 0;
  #font = 'sans';

  #textOn = 'On';
  #textOff = 'Off';

  #foregroundColor = '';
  #backgroundColor = '';
  #hoverForegroundColor = '';
  #hoverBackgroundColor = '';
  #hoverBorderColor = '';
  #view = null;

  #onChange = null;

  /**
   * Create a new Button.
   * @param {Widget} parent Assign a parent Widget during creation
   * @param {String} name Assign a name during creation
   */
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

  set value(val) {
    this.#value = val;
  }

  get value() {
    return this.#value;
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

    if (this._mouseHover) {
      foregroundColor = this.#hoverForegroundColor;
    }

    return foregroundColor;
  }

  get onChange() {
    return this.#onChange;
  }

  set onChange(val) {
    this.#onChange = null;
    if (typeof val === 'function') {
      this.#onChange = val;
    }
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
        this.radii = [8, 8, 8, 8];
        this.padding = [8, 8, 16, 16];
        break;
      case Button.Size.Medium:
        this.radii = [6, 6, 6, 6];
        this.padding = [6, 6, 12, 12];
        break;
      case Button.Size.Small:
        this.radii = [4, 4, 4, 4];
        this.padding = [4, 4, 8, 8];
        break;
      default:
        throw new Error('Invalid size');
    }
  }

  _eventMouseMove(event) {
    this._mousePosX = event.x;
    this._mousePosY = event.y;

    if (this.#view === null) {
      return;
    }

    const x = this.body.x + (this.body.w / 2) - (this.#view.width / 2) + (this.#borderWidth / 2);
    const y = this.body.y + (this.body.h / 2) - (this.#view.height / 2) + (this.#borderWidth / 2);
    const w = (this.#view.width / 2) + 5 - this.#borderWidth;
    const h = this.#view.height - this.#borderWidth;

    if (
      this._mousePosX > x
      && this._mousePosX < x + w
      && this._mousePosY > y
      && this._mousePosY < y + h
    ) {
      this._mouseHover = true;
    } else {
      this._mouseHover = false;
    }
  }

  _eventMouseButtonDown() {
    if (this.#view === null) {
      return;
    }

    const x = this.body.x + (this.body.w / 2) - (this.#view.width / 2) + (this.#borderWidth / 2);
    const y = this.body.y + (this.body.h / 2) - (this.#view.height / 2) + (this.#borderWidth / 2);
    const w = (this.#view.width / 2) + 5 - this.#borderWidth;
    const h = this.#view.height - this.#borderWidth;

    if (
      this._mousePosX > x
      && this._mousePosX < x + w
      && this._mousePosY > y
      && this._mousePosY < y + h
    ) {
      this._mouseDown = true;
    } else {
      this._mouseDown = false;
    }
  }

  _eventMouseButtonUp() {
    if (this.#view === null) {
      return;
    }

    const x = this.body.x + (this.body.w / 2) - (this.#view.width / 2) + (this.#borderWidth / 2);
    const y = this.body.y + (this.body.h / 2) - (this.#view.height / 2) + (this.#borderWidth / 2);
    const w = (this.#view.width / 2) + 5 - this.#borderWidth;
    const h = this.#view.height - this.#borderWidth;

    if (
      this._mousePosX > x
      && this._mousePosX < x + w
      && this._mousePosY > y
      && this._mousePosY < y + h
    ) {
      this._mouseClick = true;
    }
    this._mouseDown = false;
  }

  _performLayout() {
    const padding = 10;

    this.#view = Canvas.createCanvas(this.body.w, this.body.h);
    let viewCtx = this.#view.getContext('2d');

    viewCtx.fillStyle = this.#calcForeground;
    viewCtx.font = `${this.#fontSize}px ${this.#font}`;

    const chInfoOn = viewCtx.measureText(this.#textOn);
    const chInfoOff = viewCtx.measureText(this.#textOff);

    const w = chInfoOn.width + chInfoOff.width + (padding * 4) + 10;
    const h = chInfoOn.emHeightAscent + chInfoOn.emHeightDescent + (padding * 2);

    this.#view = Canvas.createCanvas(w, h);
    viewCtx = this.#view.getContext('2d');

    let x = padding + (this.#borderWidth / 2);
    let y = h / 2;
    y += (chInfoOn.emHeightAscent / 2) - this.#borderWidth;
    y -= (chInfoOn.emHeightDescent / 2) - this.#borderWidth;

    viewCtx.clearRect(0, 0, w, h);
    viewCtx.fillText(this.#textOn, x, y);

    x += chInfoOn.width + (padding * 2) + 5;
    viewCtx.fillText(this.#textOff, x, y);

    viewCtx.beginPath();
    viewCtx.lineWidth = this.#borderWidth;
    viewCtx.roundRect(chInfoOn.width + (padding * 2), 0, 10, h, this.#radii);
    viewCtx.stroke();
    viewCtx.fill();
  }

  _preDraw() {
    if (this._mouseClick) {
      this.#value = !this.#value;
      if (this._mouseClick && this.#onChange !== null) {
        this.#onChange(this.#value);
      }
    }
    super._preDraw();
  }

  _draw(canvasCtx, depth = 0) {
    if (this.constructor.name === 'Button') {
      this._logme(depth);
    }

    if (this.#view === null) {
      return;
    }

    canvasCtx.beginPath();

    canvasCtx.lineWidth = this.#borderWidth;
    canvasCtx.fillStyle = this.#calcBackground;
    canvasCtx.strokeStyle = this.#calcBorder;

    const x = this.body.x + (this.body.w / 2) - (this.#view.width / 2) + (canvasCtx.lineWidth / 2);
    const y = this.body.y + (this.body.h / 2) - (this.#view.height / 2) + (canvasCtx.lineWidth / 2);
    const w = (this.#view.width / 2) + 5 - canvasCtx.lineWidth;
    const h = this.#view.height - canvasCtx.lineWidth;

    if (this.#value) {
      canvasCtx.roundRect(x, y, w, h, this.#radii);
      canvasCtx.fill();
    }

    canvasCtx.save();
    canvasCtx.roundRect(x, y, w, h, this.#radii);
    canvasCtx.clip();

    canvasCtx.drawImage(
      this.#view,
      this.#value ? 0 : this.#view.width / 2 - 5,
      0,
      this.#view.width / 2 + 10,
      this.#view.height,
      x,
      y,
      (this.#view.width / 2) + 10,
      this.#view.height,
    );
    canvasCtx.restore();

    canvasCtx.roundRect(x, y, w, h, this.#radii);
    canvasCtx.stroke();

    super._draw(canvasCtx, depth);
  }
}

export default Button;
