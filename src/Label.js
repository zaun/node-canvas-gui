import Canvas from 'canvas';
import crypto from 'crypto';
import Colors from './Colors.js';
import Widget from './Widget.js';

/**
 * The Label widget displays a small amount of text.
 * @extends Widget
 */
class Label extends Widget {
  static #Justify = {
    Left: 0,
    Center: 1,
    Right: 2,
  };

  static get Justify() {
    return this.#Justify;
  }

  #text = '';
  #font = 'sans';
  #fontSize = 20;
  #foreground = Colors.Black;
  #view = null;
  #justify = Label.Justify.Center;

  /**
   * Create a new Label.
   * @param {Widget} parent Assign a parent Widget during creation
   * @param {String} name Assign a name during creation
   */
  constructor(parent = null, name = crypto.randomUUID()) {
    super(parent, name);

    this.padding = 3;

    if (new.target === Label) {
      Object.preventExtensions(this);
    }
  }

  get text() {
    return this.#text;
  }

  set text(val) {
    this.#text = val.toString();
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
    return this.#fontSize;
  }

  set fontSize(val) {
    this.#fontSize = val;
    this._performLayout();
  }

  get foreground() {
    return this.#foreground;
  }

  set foreground(val) {
    this.#foreground = val;
    this._performLayout();
  }

  get justify() {
    return this.#justify;
  }

  set justify(val) {
    this.#justify = val;
    this._performLayout();
  }

  _performLayout() {
    try {
      this.#view = Canvas.createCanvas(this.body.w, this.body.h);
      const viewCtx = this.#view.getContext('2d');
      viewCtx.textBaseline = 'top';

      viewCtx.fillStyle = this.#foreground;
      viewCtx.font = `${this.#fontSize}px ${this.#font}`;

      const lines = this.#text.split('\n');

      let chInfo = viewCtx.measureText(lines[0]);
      const lineHeight = chInfo.emHeightAscent + chInfo.emHeightDescent + 2;

      const y = (this.body.h / 2) - ((lines.length * lineHeight) / 2);
      lines.forEach((line, idx) => {
        chInfo = viewCtx.measureText(line);
        let x = (this.body.w / 2) - (chInfo.width / 2);
        if (this.#justify === Label.Justify.Left) {
          x = 0;
        } else if (this.#justify === Label.Justify.Right) {
          x = this.body.w - chInfo.width;
        }

        viewCtx.fillText(line, x, y + (idx * lineHeight));
      });
    } catch (e) {
      // FIXME: I don't know why this is happening. It's like this
      //        function is being called with the wrong 'this' sometimes.
      // console.log(e);
      // console.log(this.name, this.constructor.name, this.text);
      // console.log(this.parent ? this.parent.name : '');
    }
  }

  _draw(canvasCtx, depth = 0) {
    super._draw(canvasCtx, depth);

    if (this.constructor.name === 'Label') {
      this._logme(depth);
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

    // canvasCtx.strokeStyle = '#333333';
    // canvasCtx.strokeRect(this.body.x, this.body.y, this.body.w, this.body.h);
  }
}

export default Label;
