/**
 * The base object of all Widgets. This handles incoming events
 * from the system (node-sdl) and propigates them out to the
 * widget tree.
 */
class EventSource {
  _eventSource = null;

  get eventSource() {
    if (this._eventSource === null) {
      if (this.parent instanceof EventSource) {
        return this.parent.eventSource;
      }
      return null;
    }
    return this._eventSource;
  }

  set eventSource(val) {
    this._eventSource = val;

    if (typeof val._native !== 'undefined') {
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
          x: event.x,
          y: event.y,
          dx: event.flipped === true ? event.dx * -1 : event.dx,
          dy: event.flipped === true ? event.dy * -1 : event.dy,
        });
      }
    });

    this._eventSource.on('keyDown', (event) => {
      if (typeof this._eventKeyDown === 'function') {
        this._eventKeyDown(event);
      }
    });
  }
}

export default EventSource;
