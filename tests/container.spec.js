import {
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import Container from '../src/Container.js';
import Widget from '../src/Widget.js';

describe('Testing the Container class', () => {
  beforeEach(() => {
    Widget.debug = false;
    Container.testing = true;
  });

  afterEach(() => {
    Container.testing = false;
    jest.clearAllMocks();
  });

  describe('Container static', () => {
    test('Static debug should be false', async () => {
      expect(Container.debug).toEqual(false);
      Container.debug = true;
      expect(Container.debug).toEqual(true);
      Container.debug = false;
      expect(Container.debug).toEqual(false);
    });

    test('Static have emuns', async () => {
      expect(Container.Orientation).toBeDefined();
      expect(Object.keys(Container.Orientation)).toHaveLength(2);
      expect(() => {
        Container.Orientation.foo = 99;
      }).toThrow();

      expect(Container.AlignItems).toBeDefined();
      expect(Object.keys(Container.AlignItems)).toHaveLength(3);
      expect(() => {
        Container.AlignItems.foo = 99;
      }).toThrow();

      expect(Container.JustifyItems).toBeDefined();
      expect(Object.keys(Container.JustifyItems)).toHaveLength(5);
      expect(() => {
        Container.JustifyItems.foo = 99;
      }).toThrow();
    });
  });

  describe('Container contrustor tests', () => {
    test('Should have expected defaults with no parent and no name', async () => {
      const widget = new Container();

      expect(widget.parent).toEqual(null);
      expect(widget.name).toMatch(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/);
    });

    test('Should have expected defaults with parent and name', async () => {
      const root = new Container();
      const widget = new Container(root, 'FOO');

      expect(widget.parent).toEqual(root);
      expect(widget.name).toEqual('FOO');
    });

    test('Should error if not passing a Widget as the parent', async () => {
      expect(() => new Container(123)).toThrow(Error);
    });

    test('Should error if not passing a Container as the parent', async () => {
      const widget = new Widget();
      expect(() => new Container(widget)).toThrow(Error);
    });

    test('Should not error is not passing a null as the parent', async () => {
      expect(() => new Container(null)).not.toThrow(Error);
    });

    test('Should prevent extensions when not testing', async () => {
      Container.testing = false;
      const widget = new Container();
      expect(() => {
        widget.foo = true;
      }).toThrow(Error);
    });
  });

  describe('Container child tests', () => {
    test('Should add a child', () => {
      const widget = new Container();
      const child = new Widget();

      const localSpy = jest.spyOn(widget, '_performLayout');

      widget.addChild(child);

      expect(child.parent).toEqual(widget);
      expect(localSpy).toHaveBeenCalledTimes(1);
      expect(widget.children).toHaveLength(1);
    });

    test('Should not add a child twice', () => {
      const widget = new Container();
      const child = new Widget();

      const localSpy = jest.spyOn(widget, '_performLayout');

      widget.addChild(child);
      widget.addChild(child);

      expect(child.parent).toEqual(widget);
      expect(localSpy).toHaveBeenCalledTimes(1);
      expect(widget.children).toHaveLength(1);
    });

    test('Should remove a child', () => {
      const widget = new Container();
      const child = new Widget();

      const localSpy = jest.spyOn(widget, '_performLayout');

      widget.addChild(child);

      expect(child.parent).toEqual(widget);
      expect(localSpy).toHaveBeenCalledTimes(1);

      widget.removeChild(child);

      expect(child.parent).toEqual(null);
      expect(localSpy).toHaveBeenCalledTimes(2);
      expect(widget.children).toHaveLength(0);
    });

    test('Should remove all children', () => {
      const widget = new Container();
      const childA = new Widget();
      const childB = new Widget();

      widget.addChild(childA);
      widget.addChild(childB);

      const localSpy = jest.spyOn(widget, '_performLayout');

      widget.removeChildren();

      expect(childA.parent).toEqual(null);
      expect(childB.parent).toEqual(null);

      expect(localSpy).toHaveBeenCalledTimes(2);
      expect(widget.children).toHaveLength(0);
    });

    test('Should not remove a non-child', () => {
      const widget = new Container();
      const widgetB = new Container();
      const child = new Widget();

      const localSpy = jest.spyOn(widget, '_performLayout');

      widgetB.addChild(child);
      widget.removeChild(child);

      expect(child.parent).toEqual(widgetB);
      expect(localSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('Container property tests', () => {
    test('Should set spacing', () => {
      const widget = new Container();

      const localSpy = jest.spyOn(widget, '_performLayout');

      expect(widget.spacing).toEqual(5);

      widget.spacing = 10;

      expect(widget.spacing).toEqual(10);
      expect(localSpy).toHaveBeenCalledTimes(1);
    });

    test('Should not set spacing negative', () => {
      const widget = new Container();

      expect(() => {
        widget.spacing = -1;
      }).toThrow();
    });

    test('Should not set spacing to non-number', () => {
      const widget = new Container();

      expect(() => {
        widget.spacing = 'foo';
      }).toThrow();
    });

    test('Should set justifyIems', () => {
      const widget = new Container();

      const localSpy = jest.spyOn(widget, '_performLayout');

      widget.justifyItems = Container.JustifyItems.Around;

      expect(widget.justifyItems).toEqual(Container.JustifyItems.Around);
      expect(localSpy).toHaveBeenCalledTimes(1);
    });

    test('Should set justifyIems and not call preformLayout for same value', () => {
      const widget = new Container();

      const localSpy = jest.spyOn(widget, '_performLayout');

      expect(widget.justifyItems).toEqual(Container.JustifyItems.Start);

      widget.justifyItems = Container.JustifyItems.Start;

      expect(localSpy).toHaveBeenCalledTimes(0);
    });

    test('Should not set justifyItems to invalid value', () => {
      const widget = new Container();

      expect(() => {
        widget.justifyItems = 'FOO';
      }).toThrow();
    });

    test('Should set alignItems', () => {
      const widget = new Container();

      const localSpy = jest.spyOn(widget, '_performLayout');

      widget.alignItems = Container.AlignItems.Start;

      expect(widget.alignItems).toEqual(Container.AlignItems.Start);
      expect(localSpy).toHaveBeenCalledTimes(1);
    });

    test('Should set alignItems and not call preformLayout for same value', () => {
      const widget = new Container();

      const localSpy = jest.spyOn(widget, '_performLayout');

      expect(widget.alignItems).toEqual(Container.JustifyItems.Center);

      widget.alignItems = Container.JustifyItems.Center;

      expect(localSpy).toHaveBeenCalledTimes(0);
    });

    test('Should not set alignItems to invalid value', () => {
      const widget = new Container();

      expect(() => {
        widget.alignItems = 'FOO';
      }).toThrow();
    });

    test('Should set orientation', () => {
      const widget = new Container();

      const localSpy = jest.spyOn(widget, '_performLayout');

      widget.orientation = Container.Orientation.Vertical;

      expect(widget.orientation).toEqual(Container.Orientation.Vertical);
      expect(localSpy).toHaveBeenCalledTimes(1);
    });

    test('Should set orientation and not call preformLayout for same value', () => {
      const widget = new Container();

      const localSpy = jest.spyOn(widget, '_performLayout');

      expect(widget.orientation).toEqual(Container.Orientation.Horizontal);

      widget.orientation = Container.Orientation.Horizontal;

      expect(localSpy).toHaveBeenCalledTimes(0);
    });

    test('Should not set orientation to invalid value', () => {
      const widget = new Container();

      expect(() => {
        widget.orientation = 'FOO';
      }).toThrow();
    });

    test('Should set autoHeight to true', () => {
      const widget = new Container();

      const localSpy = jest.spyOn(widget, '_performLayout');

      widget.autoHeight = true;

      expect(widget.autoHeight).toEqual(true);
      expect(localSpy).toHaveBeenCalledTimes(1);
    });

    test('Should clear fixedHeight if setting autoHeight to false', () => {
      const widget = new Container();
      widget.orientation = Container.Orientation.Vertical;
      const child = new Widget();
      child.fixedHeight = 10;
      child.parent = widget;

      const localSpy = jest.spyOn(widget, '_performLayout');

      widget.autoHeight = true;

      expect(widget.autoHeight).toEqual(true);
      expect(widget.fixedHeight).toEqual(10);
      expect(localSpy).toHaveBeenCalledTimes(3);

      widget.autoHeight = false;
      expect(widget.autoHeight).toEqual(false);
      expect(localSpy).toHaveBeenCalledTimes(4);
      expect(widget.fixedHeight).toEqual(0);
    });

    test('Should not set autoHeight to non boolean', () => {
      const widget = new Container();

      const localSpy = jest.spyOn(widget, '_performLayout');

      expect(() => {
        widget.autoHeight = 'true';
      }).toThrow();

      expect(localSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('Container events', () => {
    let mockEventSource = {};

    beforeEach(() => {
      mockEventSource = {};
      mockEventSource._native = 'foo';
      mockEventSource.on = (name, fn) => {
        mockEventSource[name] = fn;
      };
    });

    test('Should handle mouseMove event', () => {
      const widget = new Container();
      widget.eventSource = mockEventSource;
      widget.container = [0, 0, 5, 5];
      const child = new Widget();
      child.parent = widget;

      mockEventSource.mouseMove({ x: 10, y: 20 });

      expect(widget._mousePosX).toEqual(10);
      expect(widget._mousePosY).toEqual(20);
      expect(widget.mouseHover).toEqual(false);

      expect(child._mousePosX).toEqual(10);
      expect(child._mousePosY).toEqual(20);
      expect(child.mouseHover).toEqual(false);
    });

    test('Should handle mouse button events', () => {
      const widget = new Container();
      widget.eventSource = mockEventSource;
      widget.container = [0, 0, 5, 5];
      const child = new Widget();
      child.parent = widget;

      mockEventSource.mouseMove({ x: 10, y: 20 });

      expect(widget._mousePosX).toEqual(10);
      expect(widget._mousePosY).toEqual(20);
      expect(widget._mouseDown).toEqual(false);
      expect(widget.mouseClick).toEqual(false);

      expect(child._mousePosX).toEqual(10);
      expect(child._mousePosY).toEqual(20);
      expect(child._mouseDown).toEqual(false);
      expect(child.mouseClick).toEqual(false);

      mockEventSource.mouseButtonDown({ x: 20, y: 30 });

      expect(widget._mousePosX).toEqual(20);
      expect(widget._mousePosY).toEqual(30);
      expect(widget._mouseDown).toEqual(false);
      expect(widget.mouseClick).toEqual(false);

      expect(child._mousePosX).toEqual(20);
      expect(child._mousePosY).toEqual(30);
      expect(child._mouseDown).toEqual(false);
      expect(child.mouseClick).toEqual(false);

      mockEventSource.mouseButtonUp({ x: 30, y: 40 });

      expect(widget._mousePosX).toEqual(30);
      expect(widget._mousePosY).toEqual(40);
      expect(widget._mouseDown).toEqual(false);
      expect(widget.mouseClick).toEqual(false);

      expect(child._mousePosX).toEqual(30);
      expect(child._mousePosY).toEqual(40);
      expect(child._mouseDown).toEqual(false);
      expect(child.mouseClick).toEqual(false);
    });
  });

  describe('Container drawing', () => {
    test('Should draw children', () => {
      const widget = new Container();
      const child = new Widget();

      child.parent = widget;

      const childPre = jest.spyOn(child, '_preDraw');
      const childDraw = jest.spyOn(child, '_draw');
      const childPost = jest.spyOn(child, '_postDraw');

      widget.draw({});

      expect(childPre).toHaveBeenCalledTimes(1);
      expect(childDraw).toHaveBeenCalledTimes(1);
      expect(childDraw).toHaveBeenCalledWith({}, 1);
      expect(childPost).toHaveBeenCalledTimes(1);
      expect(childPost).toHaveBeenCalledWith({}, 1);
    });
  });

  describe('Container debugging', () => {
    test('Should log drawing', () => {
      Widget.debug = true;

      const logSpy = jest.spyOn(console, 'log');

      const widget = new Container();
      widget.draw();

      expect(logSpy).toHaveBeenCalledTimes(1);
    });

    test('Should not log exgtended drawing', () => {
      Widget.debug = true;

      const logSpy = jest.spyOn(console, 'log');

      class Test extends Container { }
      const widget = new Test();
      widget.draw();

      expect(logSpy).toHaveBeenCalledTimes(0);
    });
  });
});
