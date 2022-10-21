export default class EventSource {
  _eventSource = null;

  get eventSource() {
    if (this._eventSource === null) {
      if (this._parent !== null) {
        return this._parent._eventSource;
      }
      return null;
    }
    return this._eventSource;
  }

  set eventSource(val) {
    this._eventSource = val;

    if (val.native) {
      this.#setupSDLEvents();
    } else {
      this._eventSource = null;
      throw new Error('Unknown event source');
    }
  }

  #setupSDLEvents() {
    this._eventSource.on('mouseMove', (event) => {
      if (typeof this._eventMouseMove === 'function') {
        this._eventMouseMove({ x: event.x, y: event.y });
      }
    });

    this._eventSource.on('mouseButtonDown', (event) => {
      if (typeof this._eventMouseMove === 'function') {
        this._eventMouseMove({ x: event.x, y: event.y });
      }
      if (typeof this._eventMouseButtonDown === 'function') {
        this._eventMouseButtonDown({ button: event.button });
      }
    });

    this._eventSource.on('mouseButtonUp', (event) => {
      if (typeof this._eventMouseMove === 'function') {
        this._eventMouseMove({ x: event.x, y: event.y });
      }
      if (typeof this._eventMouseButtonUp === 'function') {
        this._eventMouseButtonUp({ button: event.button });
      }
    });

    this._eventSource.on('mouseWheel', (event) => {
      if (typeof this._eventMouseMove === 'function') {
        this._eventMouseMove({ x: event.x, y: event.y });
      }
      if (typeof this._eventMouseWheel === 'function') {
        this._eventMouseWheel({
          dx: event.flipped === true ? event.dx * -1 : event.dx,
          dy: event.flipped === true ? event.dy * -1 : event.dy,
        });
      }
    });
  }
}
