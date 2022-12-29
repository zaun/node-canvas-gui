import crypto from 'crypto';
import Widget from './Widget.js';

class Spinner extends Widget {
  static #tick = false;
  static #spinnerInterval;

  static {
    Spinner.#spinnerInterval = setInterval(() => {
      Spinner.#tick = !Spinner.#tick;
    }, 500);
    Spinner.#spinnerInterval.unref();
  }

  #updateInterval;
  #stopped = false;
  #speed = 0.5;
  #percent = 0;
  #fontSize = 16;
  #text = 'Loading...';

  /**
   * Create a new Spinner.
   * @param {Widget} parent Assign a parent Widget during creation
   * @param {String} name Assign a name during creation
   */
  constructor(parent = null, name = crypto.randomUUID()) {
    super(parent, name);

    this.#updateInterval = setInterval(() => {
      this._performLayout();
    }, 10);
    this.#updateInterval.unref();

    if (new.target === Spinner) {
      Object.preventExtensions(this);
    }
  }

  get percent() {
    return Math.min(this.#percent, 100);
  }

  set percent(val) {
    this.#percent = val;
  }

  get stopped() {
    return this.#stopped;
  }

  set stopped(val) {
    this.#stopped = val;
  }

  get speed() {
    return this.#speed;
  }

  set speed(val) {
    this.#speed = val;
  }

  get fontSize() {
    return this.#fontSize;
  }

  set fontSize(val) {
    this.#fontSize = val;
  }

  _performLayout() {
    if (this.#stopped) {
      return;
    }
    this.#percent = (this.#percent + (this.#speed * 2000) / 360) % 100;
  }

  #drawModeA(canvasCtx) {
    canvasCtx.font = `${this.#fontSize}px sans`;
    const chInfo = canvasCtx.measureText(this.#text);

    let radius = chInfo.width * 0.75;
    if (radius < chInfo.emHeightAscent + chInfo.emHeightDescent) {
      radius = chInfo.emHeightAscent + chInfo.emHeightDescent;
    }
    if (radius < 50) {
      radius = 50;
    }

    const angle = Math.PI * 2 * (this.percent / 100);
    const x = this.body.x + (this.body.w / 2);
    const y = this.body.y + (this.body.h / 2);

    const grad = canvasCtx.createLinearGradient(
      x + Math.sin(Math.PI * 1.5 - angle) * radius,
      y + Math.cos(Math.PI * 1.5 - angle) * radius,
      x + Math.sin(Math.PI * 0.5 - angle) * radius,
      y + Math.cos(Math.PI * 0.5 - angle) * radius,
    );

    grad.addColorStop(0, '#00000000');
    grad.addColorStop(1, '#000000');

    canvasCtx.lineWidth = radius / 20;
    canvasCtx.lineCap = 'round';
    canvasCtx.strokeStyle = grad;
    canvasCtx.beginPath();
    canvasCtx.arc(x, y, radius, angle - Math.PI, angle, false);
    canvasCtx.stroke();
    canvasCtx.strokeStyle = '#00000022';
    canvasCtx.beginPath();
    canvasCtx.arc(x, y, radius - 1, 0, Math.PI * 2, true);
    canvasCtx.stroke();

    const textX = this.body.x + (this.body.w / 2);
    let textY = this.body.y + (this.body.h / 2);
    textY += (chInfo.emHeightAscent / 2);
    textY -= (chInfo.emHeightDescent / 2);

    canvasCtx.fillStyle = '#000000';
    canvasCtx.fillText(this.#text, textX - (chInfo.width / 2), textY);
  }

  _draw(canvasCtx, depth = 0) {
    if (this.constructor.name === 'Spinner') {
      this._logme(depth);
    }
    canvasCtx.save();

    this.#drawModeA(canvasCtx);

    canvasCtx.restore();
    super._draw(canvasCtx, depth);
  }
}

export default Spinner;
