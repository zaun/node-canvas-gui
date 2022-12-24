import {
  expect,
  jest,
  test,
} from '@jest/globals';
import EventSource from '../src/EventSource.js';

describe('Testing the EventSource class', () => {
  let mockEventSource = {};

  beforeEach(() => {
    mockEventSource = {};
    mockEventSource._native = 'foo';
    mockEventSource.on = jest.fn();
  });

  test('Should create a event source', () => {
    const source = new EventSource();
    expect(source).toBeDefined();
  });

  test('Should throw on invalid event source', () => {
    const es = new EventSource();

    expect(() => {
      es.eventSource = 'FOO';
    }).toThrow();
  });

  test('Should nested event sources', () => {
    const parent = new EventSource();

    const es = new EventSource();

    expect(es.eventSource).toEqual(null); // no parent no source

    es.parent = parent;

    expect(es.eventSource).toEqual(null); // parent no source

    parent.eventSource = mockEventSource;

    expect(es.eventSource).not.toEqual(null);
  });

  test('Should setup event source', () => {
    const es = new EventSource();
    es.eventSource = mockEventSource;

    expect(mockEventSource.on).toHaveBeenCalledTimes(5);
    expect(mockEventSource.on).toHaveBeenNthCalledWith(1, 'mouseMove', expect.any(Function));
    expect(mockEventSource.on).toHaveBeenNthCalledWith(2, 'mouseButtonDown', expect.any(Function));
    expect(mockEventSource.on).toHaveBeenNthCalledWith(3, 'mouseButtonUp', expect.any(Function));
    expect(mockEventSource.on).toHaveBeenNthCalledWith(4, 'mouseWheel', expect.any(Function));
    expect(mockEventSource.on).toHaveBeenNthCalledWith(5, 'keyDown', expect.any(Function));
  });

  test('Should handle events without callbacks', () => {
    mockEventSource.on = (name, fn) => {
      mockEventSource[name] = fn;
    };

    const es = new EventSource();
    es.eventSource = mockEventSource;

    expect(() => {
      mockEventSource.mouseMove();
    }).not.toThrow();

    expect(() => {
      mockEventSource.mouseButtonDown();
    }).not.toThrow();

    expect(() => {
      mockEventSource.mouseButtonUp();
    }).not.toThrow();

    expect(() => {
      mockEventSource.mouseWheel();
    }).not.toThrow();

    expect(() => {
      mockEventSource.keyDown();
    }).not.toThrow();
  });

  test('Should handle mousewheel event flipping', () => {
    mockEventSource.on = (name, fn) => {
      mockEventSource[name] = fn;
    };

    const es = new EventSource();
    es.eventSource = mockEventSource;
    es._eventMouseWheel = jest.fn();

    mockEventSource.mouseWheel({
      x: 1, y: 2, dx: 3, dy: 4,
    });

    expect(es._eventMouseWheel).toHaveBeenCalledWith({
      x: 1, y: 2, dx: 3, dy: 4,
    });

    mockEventSource.mouseWheel({
      x: 1, y: 2, dx: 3, dy: 4, flipped: true,
    });

    expect(es._eventMouseWheel).toHaveBeenCalledWith({
      x: 1, y: 2, dx: -3, dy: -4,
    });
  });
});
