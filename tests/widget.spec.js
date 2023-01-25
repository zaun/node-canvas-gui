import {
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import Container from '../src/Container.js';
import Widget from '../src/Widget.js';

describe('Testing the base Widget class', () => {
  beforeEach(() => {
    Widget.debug = false;
    Widget.testing = true;
  });

  afterEach(() => {
    Widget.testing = false;
    jest.clearAllMocks();
  });

  test('Static test static property debug', async () => {
    expect(Widget.debug).toEqual(false);
    Widget.debug = true;
    expect(Widget.debug).toEqual(true);
    Widget.debug = false;
    expect(Widget.debug).toEqual(false);

    expect(() => {
      Widget.debug = 'foo';
    }).toThrow();
  });

  test('Static test static property test', async () => {
    expect(Widget.testing).toEqual(true);
    Widget.testing = false;
    expect(Widget.testing).toEqual(false);

    expect(() => {
      Widget.testing = 'foo';
    }).toThrow();
  });

  describe('Widget contrustor tests', () => {
    test('Should have expected defaults with no parent and no name', async () => {
      const widget = new Widget();

      expect(widget.parent).toEqual(null);
      expect(widget.name).toMatch(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/);
    });

    test('Should have expected defaults with parent and name', async () => {
      const root = new Container();
      const widget = new Widget(root, 'FOO');

      expect(widget.parent).toEqual(root);
      expect(widget.name).toEqual('FOO');
    });

    test('Should error if not passing a Widget as the parent', async () => {
      expect(() => new Widget(123)).toThrow(Error);
    });

    test('Should error if not passing a Container as the parent', async () => {
      const widget = new Widget();
      expect(() => new Widget(widget)).toThrow(Error);
    });

    test('Should not error is not passing a null as the parent', async () => {
      expect(() => new Widget(null)).not.toThrow(Error);
    });

    test('Should prevent extensions when not testing', async () => {
      Widget.testing = false;
      const widget = new Widget();
      expect(() => {
        widget.foo = true;
      }).toThrow(Error);
    });
  });

  describe('Widget parent tests', () => {
    test('should set parent', () => {
      const parent = new Container();
      const widget = new Widget();

      const addChildSpy = jest.spyOn(parent, 'addChild');
      const removeChildSpy = jest.spyOn(parent, 'removeChild');

      widget.parent = parent;

      expect(widget.parent).toEqual(parent);
      expect(addChildSpy).toHaveBeenCalledTimes(1);
      expect(removeChildSpy).toHaveBeenCalledTimes(0);
    });

    test('should not set parent non-container', () => {
      const parent = new Widget();
      const widget = new Widget();

      expect(() => {
        widget.parent = parent;
      }).toThrow(Error);
    });

    test('should set parent to null', () => {
      const parent = new Container();
      const widget = new Widget();

      const addChildSpy = jest.spyOn(parent, 'addChild');
      const removeChildSpy = jest.spyOn(parent, 'removeChild');

      widget.parent = parent;
      widget.parent = null;

      expect(widget.parent).toEqual(null);
      expect(addChildSpy).toHaveBeenCalledTimes(1);
      expect(removeChildSpy).toHaveBeenCalledTimes(1);
    });

    test('should not call addChild a second time', () => {
      const parent = new Container();
      const widget = new Widget();

      const addChildSpy = jest.spyOn(parent, 'addChild');
      const removeChildSpy = jest.spyOn(parent, 'removeChild');

      widget.parent = parent;
      widget.parent = parent;

      expect(widget.parent).toEqual(parent);
      expect(addChildSpy).toHaveBeenCalledTimes(1);
      expect(removeChildSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('Widget container tests', () => {
    test('Should set container', async () => {
      const widget = new Widget();
      widget.container = [0, 0, 10, 10];

      expect(widget.container).toEqual({
        x: 0, y: 0, w: 10, h: 10,
      });
    });

    test('Should return fixed height and width for container', async () => {
      const widget = new Widget();
      widget.container = [0, 0, 10, 10];
      widget.fixedHeight = 20;
      widget.fixedWidth = 20;

      expect(widget.container).toEqual({
        x: 0, y: 0, w: 20, h: 20,
      });
    });

    test('Should not set container to string', async () => {
      const widget = new Widget();
      expect(() => {
        widget.container = 'foo';
      }).toThrow();
    });

    test('Should not set container to number', async () => {
      const widget = new Widget();
      expect(() => {
        widget.container = 5;
      }).toThrow();
    });

    test('Should not set container to array with string', async () => {
      const widget = new Widget();
      expect(() => {
        widget.container = [1, 2, 'foo', 4];
      }).toThrow();
    });

    test('Should not set container to array with less than 4 numbers', async () => {
      const widget = new Widget();
      expect(() => {
        widget.container = [1, 2, 3];
      }).toThrow();
    });

    test('Should not set container to array with more than 4 numbers', async () => {
      const widget = new Widget();
      expect(() => {
        widget.container = [1, 2, 3, 4, 5];
      }).toThrow();
    });

    test('Should have a container size of the parent\'s body', async () => {
      const root = new Container();
      root.container = [0, 0, 10, 10];

      const widget = new Widget(root);

      expect(widget.parent).toEqual(root);
      expect(widget.container).toEqual({
        x: 0, y: 0, w: 10, h: 10,
      });
      expect(widget.container).toEqual({
        x: 0, y: 0, w: 10, h: 10,
      });
    });

    test('Should call _performLayout when setting container', async () => {
      const widget = new Widget();
      const localSpy = jest.spyOn(widget, '_performLayout');

      widget.container = [10, 10, 20, 20];
      expect(localSpy).toHaveBeenCalledTimes(1);
    });

    test('Should not call _performLayout when setting container with same values', async () => {
      const widget = new Widget();
      const localSpy = jest.spyOn(widget, '_performLayout');

      widget.container = [10, 10, 20, 20];
      expect(localSpy).toHaveBeenCalledTimes(1);

      widget.container = [10, 10, 20, 20];
      expect(localSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Widget body tests', () => {
    test('Should get body equal to container when no padding', async () => {
      const widget = new Widget();
      widget.container = [0, 0, 10, 10];

      expect(widget.body).toEqual({
        x: 0, y: 0, w: 10, h: 10,
      });
    });

    test('Should get body equal to container adjusted for padding', async () => {
      const widget = new Widget();
      widget.container = [0, 0, 10, 10];
      widget.padding = [1, 2, 3, 4];

      expect(widget.body).toEqual({
        x: 3, y: 1, w: 3, h: 7,
      });
    });

    test('Should not have negative width or height', async () => {
      const widget = new Widget();
      widget.container = [0, 0, 10, 10];
      widget.padding = 10;

      expect(widget.body).toEqual({
        x: 10, y: 10, w: 0, h: 0,
      });
    });
  });

  describe('Widget fixed height and width tests', () => {
    test('Should set to number', async () => {
      const widget = new Widget();
      widget.fixedWidth = 20;
      widget.fixedHeight = 30;

      expect(widget.fixedWidth).toEqual(20);
      expect(widget.fixedHeight).toEqual(30);
    });

    test('Should set to Widget', async () => {
      const testWidget = new Widget();
      testWidget.container = [0, 0, 20, 30];

      const widget = new Widget();
      widget.fixedWidth = testWidget;
      widget.fixedHeight = testWidget;

      expect(widget.fixedWidth).toEqual(20);
      expect(widget.fixedHeight).toEqual(30);
    });

    test('Should not set to negative number', async () => {
      const widget = new Widget();
      expect(() => {
        widget.fixedWidth = -5;
      }).toThrow();
      expect(() => {
        widget.fixedHeight = -5;
      }).toThrow();
    });

    test('Should not set to string', async () => {
      const widget = new Widget();
      expect(() => {
        widget.fixedWidth = 'foo';
      }).toThrow();
      expect(() => {
        widget.fixedHeight = 'foo';
      }).toThrow();
    });

    test('Should call _performLayout when setting value', async () => {
      const widget = new Widget();
      const localSpy = jest.spyOn(widget, '_performLayout');

      widget.fixedWidth = 5;
      expect(localSpy).toHaveBeenCalledTimes(1);

      widget.fixedHeight = 10;
      expect(localSpy).toHaveBeenCalledTimes(2);
    });

    test('Should not call _performLayout if value doesn not change', async () => {
      const widget = new Widget();
      const localSpy = jest.spyOn(widget, '_performLayout');

      widget.fixedWidth = 5;
      expect(localSpy).toHaveBeenCalledTimes(1);
      widget.fixedWidth = 5;
      expect(localSpy).toHaveBeenCalledTimes(1);

      widget.fixedHeight = 5;
      expect(localSpy).toHaveBeenCalledTimes(2);
      widget.fixedHeight = 5;
      expect(localSpy).toHaveBeenCalledTimes(2);
    });

    test('Should call parent _performLayout when setting value', async () => {
      const widget = new Widget();
      const localSpy = jest.spyOn(widget, '_performLayout');

      const parent = new Container();
      const parentSpy = jest.spyOn(parent, '_performLayout');

      widget.parent = parent;
      widget.fixedWidth = 5;

      expect(localSpy).toHaveBeenCalledTimes(0);
      expect(parentSpy).toHaveBeenCalledTimes(2); // when setting parent and changing value

      widget.fixedHeight = 5;

      expect(localSpy).toHaveBeenCalledTimes(0);
      expect(parentSpy).toHaveBeenCalledTimes(3); // when setting parent and changing value
    });
  });

  describe('Widget padding tests', () => {
    test('Should set padding to number', async () => {
      const widget = new Widget();
      widget.padding = 5;

      expect(widget.padding).toEqual({
        t: 5, b: 5, l: 5, r: 5,
      });
    });

    test('Should set padding to array', async () => {
      const widget = new Widget();
      widget.padding = [1, 2, 3, 4];

      expect(widget.padding).toEqual({
        t: 1, b: 2, l: 3, r: 4,
      });
    });

    test('Should not set padding to string', async () => {
      const widget = new Widget();
      expect(() => {
        widget.padding = 'foo';
      }).toThrow();
    });

    test('Should not set padding to array with string', async () => {
      const widget = new Widget();
      expect(() => {
        widget.padding = [1, 2, 'foo', 4];
      }).toThrow();
    });

    test('Should not set padding to array with less than 4 numbers', async () => {
      const widget = new Widget();
      expect(() => {
        widget.padding = [1, 2, 3];
      }).toThrow();
    });

    test('Should not set padding to array with more than 4 numbers', async () => {
      const widget = new Widget();
      expect(() => {
        widget.padding = [1, 2, 3, 4, 5];
      }).toThrow();
    });

    test('Should call _performLayout when setting padding', async () => {
      const widget = new Widget();
      const localSpy = jest.spyOn(widget, '_performLayout');

      widget.padding = 5;

      expect(localSpy).toHaveBeenCalledTimes(1);
    });

    test('Should call parent _performLayout when setting padding', async () => {
      const widget = new Widget();
      const localSpy = jest.spyOn(widget, '_performLayout');

      const parent = new Container();
      const parentSpy = jest.spyOn(parent, '_performLayout');

      widget.parent = parent;
      widget.padding = 5;

      expect(localSpy).toHaveBeenCalledTimes(0);
      expect(parentSpy).toHaveBeenCalledTimes(2); // when setting parent and changing padding
    });
  });

  describe('Widget property tests', () => {
    test('Should handel grow property', () => {
      const widget = new Widget();

      expect(widget.grow).toEqual(1);

      widget.grow = 2;
      expect(widget.grow).toEqual(2);

      expect(() => {
        widget.grow = 'a';
      }).toThrow();

      expect(() => {
        widget.grow = 0;
      }).toThrow();

      expect(() => {
        widget.grow = -1;
      }).toThrow();
    });

    test('Should handel order property', () => {
      const widget = new Widget();

      expect(widget.order).toEqual(0);

      widget.order = 1;
      expect(widget.order).toEqual(1);

      widget.order = 0;
      expect(widget.order).toEqual(0);

      expect(() => {
        widget.order = 'a';
      }).toThrow();

      expect(() => {
        widget.order = -1;
      }).toThrow();
    });

    test('Should handel visible property', () => {
      const widget = new Widget();

      expect(widget.visible).toEqual(true);

      widget.visible = false;
      expect(widget.visible).toEqual(false);

      expect(() => {
        widget.visible = 'foo';
      }).toThrow();
    });
  });

  describe('Widget events', () => {
    let mockEventSource = {};
    let mockCtx = {};

    beforeEach(() => {
      mockEventSource = {};
      mockEventSource._native = 'foo';
      mockEventSource.on = (name, fn) => {
        mockEventSource[name] = fn;
      };

      mockCtx = { };
    });

    test('Should handle mouseMove event', () => {
      const widget = new Widget();
      widget.eventSource = mockEventSource;
      widget.container = [0, 0, 5, 5];

      mockEventSource.mouseMove({ x: 10, y: 20 });

      expect(widget._mousePosX).toEqual(10);
      expect(widget._mousePosY).toEqual(20);
      expect(widget.mouseHover).toEqual(false);

      mockEventSource.mouseMove({ x: 4, y: 4 });

      expect(widget._mousePosX).toEqual(4);
      expect(widget._mousePosY).toEqual(4);
      expect(widget.mouseHover).toEqual(true);
    });

    test('Should handle mouse events outside widget container', () => {
      const widget = new Widget();
      widget.eventSource = mockEventSource;
      widget.container = [0, 0, 5, 5];

      mockEventSource.mouseMove({ x: 10, y: 20 });

      expect(widget._mousePosX).toEqual(10);
      expect(widget._mousePosY).toEqual(20);
      expect(widget._mouseDown).toEqual(false);
      expect(widget.mouseClick).toEqual(false);

      mockEventSource.mouseButtonDown({ x: 20, y: 30 });

      expect(widget._mousePosX).toEqual(20);
      expect(widget._mousePosY).toEqual(30);
      expect(widget._mouseDown).toEqual(false);
      expect(widget.mouseClick).toEqual(false);

      mockEventSource.mouseButtonUp({ x: 30, y: 40 });

      expect(widget._mousePosX).toEqual(30);
      expect(widget._mousePosY).toEqual(40);
      expect(widget._mouseDown).toEqual(false);
      expect(widget.mouseClick).toEqual(false);
    });

    test('Should handle mouse events inside widget container', () => {
      const widget = new Widget();
      widget.eventSource = mockEventSource;
      widget.container = [0, 0, 50, 50];

      mockEventSource.mouseMove({ x: 10, y: 20 });

      expect(widget._mousePosX).toEqual(10);
      expect(widget._mousePosY).toEqual(20);
      expect(widget._mouseDown).toEqual(false);
      expect(widget.mouseClick).toEqual(false);

      mockEventSource.mouseButtonDown({ x: 20, y: 30 });

      expect(widget._mousePosX).toEqual(20);
      expect(widget._mousePosY).toEqual(30);
      expect(widget._mouseDown).toEqual(true);
      expect(widget.mouseClick).toEqual(false);

      mockEventSource.mouseButtonUp({ x: 30, y: 40 });

      expect(widget._mousePosX).toEqual(30);
      expect(widget._mousePosY).toEqual(40);
      expect(widget._mouseDown).toEqual(false);
      expect(widget.mouseClick).toEqual(true);

      widget.draw(mockCtx);

      expect(widget.mouseClick).toEqual(false);
    });

    test('Should handle onMouseClick callback', () => {
      const widget = new Widget();
      widget.eventSource = mockEventSource;
      widget.container = [0, 0, 50, 50];
      widget.onMouseClick = jest.fn();

      mockEventSource.mouseButtonDown({ x: 20, y: 30 });
      mockEventSource.mouseButtonUp({ x: 20, y: 30 });

      expect(widget.onMouseClick).toHaveBeenCalledTimes(0);
      widget.draw(mockCtx);
      expect(widget.onMouseClick).toHaveBeenCalledTimes(1);
    });

    test('Should not set onMouseClick to non-function', () => {
      const widget = new Widget();
      widget.onMouseClick = 'foo';
      expect(widget.onMouseClick).toEqual(null);
    });

    test('Should handle clearing mouseClick', () => {
      const widget = new Widget(null, 'widget');
      widget.container = [0, 0, 50, 50];
      widget.eventSource = mockEventSource;
      widget.onMouseClick = jest.fn();

      mockEventSource.mouseButtonDown({ x: 20, y: 30 });
      mockEventSource.mouseButtonUp({ x: 20, y: 30 });

      expect(widget.mouseClick).toEqual(true);
      widget.draw(mockCtx);
      expect(widget.mouseClick).toEqual(false);
    });

    test('Should handle clearing parent mouseClick', () => {
      const parent = new Container();
      parent.container = [0, 0, 50, 50];
      parent.eventSource = mockEventSource;
      parent.onMouseClick = jest.fn();

      const widget = new Widget(null, 'widget');
      widget.onMouseClick = jest.fn().mockReturnValue(true);
      widget.parent = parent;

      mockEventSource.mouseButtonDown({ x: 20, y: 30 });
      mockEventSource.mouseButtonUp({ x: 20, y: 30 });

      expect(widget.mouseClick).toEqual(true);
      expect(parent.mouseClick).toEqual(true);
      widget.draw(mockCtx);
      expect(widget.mouseClick).toEqual(false);
      expect(parent.mouseClick).toEqual(false);
    });

    test('Should handle keyDown event', () => {
      const widget = new Container(null, 'root');
      widget.eventSource = mockEventSource;

      const spy = jest.spyOn(widget, '_eventKeyDown');

      mockEventSource.keyDown('EVENT');

      expect(spy).toHaveBeenCalledTimes(1);
    });

    test('Should handle mouseWheel event', () => {
      const widget = new Container(null, 'root');
      widget.container = [0, 0, 50, 50];
      widget.eventSource = mockEventSource;

      const spy = jest.spyOn(widget, '_eventMouseWheel');

      mockEventSource.mouseWheel({ x: 20, y: 30 });

      expect(spy).toHaveBeenCalledTimes(1);

      expect(widget._mousePosX).toEqual(20);
      expect(widget._mousePosY).toEqual(30);
    });
  });

  describe('Widget drawing', () => {
    test('Should log drawing', () => {
      const widget = new Widget();

      const preSpy = jest.spyOn(widget, '_preDraw');
      const drawSpy = jest.spyOn(widget, '_draw');
      const postSpy = jest.spyOn(widget, '_postDraw');

      widget.draw();

      expect(preSpy).toHaveBeenCalledTimes(1);
      expect(drawSpy).toHaveBeenCalledTimes(1);
      expect(postSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Widget root properties', () => {
    test('Should return own width and height if no parent', () => {
      const widget = new Widget();
      widget.container = [0, 0, 10, 10];

      expect(widget.rootWidth).toEqual(10);
      expect(widget.rootHeight).toEqual(10);
    });

    test('Should return width and height of root parent', () => {
      const root = new Container();
      const widget = new Widget(root);
      root.container = [0, 0, 10, 10];

      expect(widget.rootWidth).toEqual(10);
      expect(widget.rootHeight).toEqual(10);
    });
  });

  describe('Widget debugging', () => {
    beforeEach(() => {
      Widget.debug = true;
    });

    afterEach(() => {
      Widget.debug = false;
    });

    test('Should log drawing', () => {
      const logSpy = jest.spyOn(console, 'log');

      const widget = new Widget();
      widget.draw();

      expect(logSpy).toHaveBeenCalledTimes(1);
    });

    test('Should not log exgtended drawing', () => {
      const logSpy = jest.spyOn(console, 'log');

      class Test extends Widget { }
      const widget = new Test();
      widget.draw();

      expect(logSpy).toHaveBeenCalledTimes(0);
    });
  });
});
