import Canvas from 'canvas';
import crypto from 'crypto';
import Colors from './Colors.js';
import Widget from './Widget.js';

/**
 * The Input widget is a single line text entry widget. If the entered text is
 * longer than the allocation of the widget, the widget will scroll so that
 * the cursor position is visible.
 * @extends Widget
 */
class Input extends Widget {
  static Size = {
    Large: 'Large',
    Medium: 'Medium',
    Small: 'Small',
  };

  static #blink = false;
  static #blinker;

  static {
    Input.#blinker = setInterval(() => {
      Input.#blink = !Input.#blink;
    }, 500);
    Input.#blinker.unref();
  }

  _placeholder = 'Enter your full name...';
  _offset = 0;

  #font = 'sans';
  #size = -1; // Default to auto-font size

  #borderColor = '';
  #borderWidth = 4;
  #radii = [6, 6, 6, 6];

  _text = '';

  _fontSize = 0;
  _font = 'sans';

  _foregroundColor = '';
  _backgroundColor = '';
  _view = null;
  _cursorPos = 0;

  /**
   * Create a new Input.
   * @param {Widget} parent Assign a parent Widget during creation
   * @param {String} name Assign a name during creation
   */
  constructor(parent = null, name = crypto.randomUUID()) {
    super(parent, name);

    this.setSize(Input.Size.Medium);
    this.setColor(Colors.White);

    if (new.target === Input) {
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

  get value() {
    return this._text;
  }

  set value(val) {
    this._text = val.toString();
    this._performLayout();
  }

  get font() {
    return this.#font;
  }

  set font(val) {
    this.#font = val;
    this._performLayout();
  }

  get fontSize() {
    return this.#size;
  }

  set fontSize(val) {
    this.#size = val;
    this._performLayout();
  }

  set radii(val) {
    const onlyNumbers = (a) => a.every((i) => typeof i === 'number');

    if (!Number.isNaN(Number(val))) {
      this.#radii = [val, val, val, val];
    } else if (Array.isArray(val) && val.length === 4 && onlyNumbers(val)) {
      this.#radii = val;
    } else {
      throw Error('Panel radii must be a number or an array of four numbers');
    }
  }

  get radii() {
    return this.#radii;
  }

  setColor(val) {
    this._backgroundColor = val;
    this._borderColor = Colors.darker(val);
    this._foregroundColor = Colors.foregroundFor(this._backgroundColor);
    if (this._backgroundColor === Colors.White) {
      this._borderColor = Colors.Black;
    }
  }

  setSize(size) {
    switch (size) {
      case Input.Size.Large:
        this.fixedHeight = 48;
        this._fontSize = 20;
        this.radii = [8, 8, 8, 8];
        this.padding = [8, 8, 16, 16];
        break;
      case Input.Size.Medium:
        this.fixedHeight = 38;
        this._fontSize = 16;
        this.radii = [6, 6, 6, 6];
        this.padding = [6, 6, 12, 12];
        break;
      case Input.Size.Small:
        this.fixedHeight = 31;
        this._fontSize = 14;
        this.radii = [4, 4, 4, 4];
        this.padding = [4, 4, 8, 8];
        break;
      default:
        throw Error('Invalid size');
    }
  }

  _eventKeyDown(event) {
    if (!this._mouseHover) {
      return;
    }
    let { key } = event;
    if (key === 'space') {
      key = ' ';
    }
    if (key === 'backspace') {
      key = '';
      this._text = this._text.slice(0, -1);
      this._performLayout();
      return;
    }
    if (key.length > 1) {
      // eslint-disable-next-line no-console
      // console.log(key);
      key = '';
    }
    if (event.shift || event.capslock) {
      key = key.toUpperCase();
    }
    this._text += key;
    this._performLayout();
  }

  _performLayout() {
    this._view = Canvas.createCanvas(this.body.w, this.body.h);
    const viewCtx = this._view.getContext('2d');

    viewCtx.fillStyle = this._foregroundColor;
    if (this._text === '') {
      viewCtx.fillStyle += 'aa';
    }
    viewCtx.font = `${this._fontSize}px ${this._font}`;

    const chInfo = viewCtx.measureText(this._text || this._placeholder);

    // Scroll text if it wont all fit
    this._offset = chInfo.width > this.body.w - 5 ? chInfo.width - (this.body.w - 5) : 0;

    const x = this.body.x - this._offset;
    let y = this.body.y + (this.body.h / 2);
    y += (chInfo.emHeightAscent / 2);
    y -= (chInfo.emHeightDescent / 2);

    viewCtx.font = `${this._fontSize}px ${this._font}`;

    viewCtx.clearRect(0, 0, this.body.w, this.body.h);
    viewCtx.fillText(this._text || this._placeholder, x - this.body.x, y - this.body.y);

    this._cursorPos = x + chInfo.width + 2;
    if (this._text === '') {
      this._cursorPos = x;
    }
  }

  _draw(canvasCtx, depth = 0) {
    super._draw(canvasCtx, depth);
    if (this.constructor.name === 'Input') {
      this._logme(depth);
    }

    canvasCtx.beginPath();

    canvasCtx.lineWidth = this.#borderWidth;
    canvasCtx.fillStyle = this._backgroundColor;
    canvasCtx.strokeStyle = this._borderColor;

    canvasCtx.roundRect(
      this.container.x,
      this.container.y,
      this.container.w,
      this.container.h,
      this.#radii,
    );

    canvasCtx.stroke();
    canvasCtx.fill();

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

    if (this._mouseHover && Input.#blink) {
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = this._foregroundColor;
      canvasCtx.beginPath();
      canvasCtx.moveTo(this._cursorPos, this.body.y + 1);
      canvasCtx.lineTo(this._cursorPos, this.body.y + this.body.h - 2);
      canvasCtx.stroke();
    }
  }
}

export default Input;
