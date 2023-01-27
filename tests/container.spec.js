import {
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import jestImageSnapshot from 'jest-image-snapshot';
import Canvas from 'canvas';
import Container from '../src/Container.js';
import Image from '../src/Image.js';
import Panel from '../src/Panel.js';
import Widget from '../src/Widget.js';
import Colors from '../src/Colors.js';
import Shade from '../src/Shade.js';

const toMatchImageSnapshot = jestImageSnapshot.configureToMatchImageSnapshot({
  customSnapshotsDir: './tests/testImages',
});
expect.extend({ toMatchImageSnapshot });

const TEST_IMG = 'data:image/png;base64,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';
const waitForTrue = async (checkFn) => new Promise((resolve) => {
  (function waitForFoo() {
    if (checkFn()) {
      return resolve();
    }
    setTimeout(waitForFoo, 30);
    return false;
  }());
});

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
      expect(Object.keys(Container.Orientation)).toHaveLength(3);
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

    test('Should not add a non-widget', () => {
      const widget = new Container();

      expect(() => {
        widget.addChild('child');
      }).toThrow();
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

    test('Should not remove a non-widget', () => {
      const widget = new Container();

      expect(() => {
        widget.removeChild('child');
      }).toThrow();
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

    test('Should set orientation and clear fixed sizes if autoSize it active', () => {
      const widget = new Container();

      widget.autoSize = true;
      widget.fixedHeight = 10;
      widget.fixedWidth = 10;

      widget.orientation = Container.Orientation.Vertical;

      expect(widget.orientation).toEqual(Container.Orientation.Vertical);
      expect(widget.fixedHeight).toEqual(0);
      expect(widget.fixedWidth).toEqual(0);
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

    test('Should toggle autoSize', () => {
      const widget = new Container();

      widget.fixedHeight = 10;
      widget.fixedWidth = 10;
      widget.autoSize = true;

      expect(widget.autoSize).toEqual(true);
      expect(widget.fixedHeight).toEqual(0);
      expect(widget.fixedWidth).toEqual(0);

      widget.fixedHeight = 10;
      widget.fixedWidth = 10;
      widget.autoSize = false;

      expect(widget.autoSize).toEqual(false);
      expect(widget.fixedHeight).toEqual(0);
      expect(widget.fixedWidth).toEqual(0);
    });

    test('Should not set autoSize to non boolean', () => {
      const widget = new Container();

      const localSpy = jest.spyOn(widget, '_performLayout');

      expect(() => {
        widget.autoSize = 'true';
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

    describe('Horizontal children', () => {
      let canvas;
      let context;
      let widget;
      let red;
      let green;
      let blue;

      beforeEach(() => {
        widget = new Container();
        widget.orientation = Container.Orientation.Horizontal;
        widget.container = [0, 0, 500, 500];

        red = new Panel();
        red.setColor(Colors.Red);

        green = new Panel();
        green.setColor(Colors.Green);

        blue = new Panel();
        blue.setColor(Colors.Blue);

        canvas = Canvas.createCanvas(500, 500);
        context = canvas.getContext('2d');
      });

      test('Should draw with no children properly', () => {
        widget.draw(context);

        const testImageA = canvas.toBuffer('image/png');
        expect(testImageA).toMatchImageSnapshot(); // 50/50

        context.clearRect(0, 0, canvas.width, canvas.height);
      });

      test('Should position single child properly', () => {
        red.parent = widget;

        widget.draw(context);

        /**
         * red = full size
         */
        const testImageA = canvas.toBuffer('image/png');
        expect(testImageA).toMatchImageSnapshot(); // 50/50

        context.clearRect(0, 0, canvas.width, canvas.height);
      });

      test('Should handle children when no space is left', () => {
        red.parent = widget;
        green.parent = widget;
        green.fixedWidth = 1000;
        widget.draw(context);

        /**
         * red = full size
         */
        const testImageA = canvas.toBuffer('image/png');
        expect(testImageA).toMatchImageSnapshot();

        context.clearRect(0, 0, canvas.width, canvas.height);
      });

      test('Should position single manually positioned child properly', () => {
        const shade = new Shade();
        shade.parent = widget;

        widget.draw(context);

        /**
         * red = full size
         */
        const testImageA = canvas.toBuffer('image/png');
        expect(testImageA).toMatchImageSnapshot(); // 50/50

        context.clearRect(0, 0, canvas.width, canvas.height);
      });

      test('Should position children evenly', () => {
        red.parent = widget;
        green.parent = widget;

        widget.draw(context);

        /**
         * red = 1 half
         * green = 1 half
         */
        const testImageA = canvas.toBuffer('image/png');
        expect(testImageA).toMatchImageSnapshot(); // 50/50

        context.clearRect(0, 0, canvas.width, canvas.height);

        blue.parent = widget;

        widget.draw(context);

        /**
         * red = 1 thirds
         * green = 1 thrid
         * blue = 1 thrid
         */
        const testImageB = canvas.toBuffer('image/png');
        expect(testImageB).toMatchImageSnapshot(); // 33/33/33
      });

      test('Should position children evenly ordered by the order property', () => {
        red.parent = widget;
        red.order = 3;
        green.parent = widget;
        green.order = 1;
        blue.parent = widget;
        blue.order = 2;

        widget.draw(context);

        /**
         * Order = green, blue, red
         */
        const testImage = canvas.toBuffer('image/png');
        expect(testImage).toMatchImageSnapshot();
      });

      test('Should size childred based on the grow property', () => {
        red.parent = widget;
        red.grow = 2;
        green.parent = widget;

        widget.draw(context);

        /**
         * red = 2 thirds
         * green = 1 thrid
         */
        const testImage = canvas.toBuffer('image/png');
        expect(testImage).toMatchImageSnapshot();
      });

      test('Should start justify children', () => {
        widget.justifyItems = Container.JustifyItems.Start;

        red.parent = widget;
        red.fixedWidth = 25;
        green.parent = widget;
        green.fixedWidth = 25;

        widget.draw(context);

        const testImage = canvas.toBuffer('image/png');
        expect(testImage).toMatchImageSnapshot();
      });

      test('Should center justify children', () => {
        widget.justifyItems = Container.JustifyItems.Center;

        red.parent = widget;
        red.fixedWidth = 25;
        green.parent = widget;
        green.fixedWidth = 25;

        widget.draw(context);

        const testImage = canvas.toBuffer('image/png');
        expect(testImage).toMatchImageSnapshot();
      });

      test('Should end justify children', () => {
        widget.justifyItems = Container.JustifyItems.End;

        red.parent = widget;
        red.fixedWidth = 25;
        green.parent = widget;
        green.fixedWidth = 25;

        widget.draw(context);

        const testImage = canvas.toBuffer('image/png');
        expect(testImage).toMatchImageSnapshot();
      });

      test('Should add space around justify children', () => {
        widget.justifyItems = Container.JustifyItems.Around;

        red.parent = widget;
        red.fixedWidth = 25;
        green.parent = widget;
        green.fixedWidth = 25;

        widget.draw(context);

        const testImage = canvas.toBuffer('image/png');
        expect(testImage).toMatchImageSnapshot();
      });

      test('Should add space between justify children', () => {
        widget.justifyItems = Container.JustifyItems.Between;

        red.parent = widget;
        red.fixedWidth = 25;
        green.parent = widget;
        green.fixedWidth = 25;

        widget.draw(context);

        const testImage = canvas.toBuffer('image/png');
        expect(testImage).toMatchImageSnapshot();
      });

      test('Should start align children', () => {
        widget.justifyItems = Container.JustifyItems.Around;
        widget.alignItems = Container.AlignItems.Start;

        red.parent = widget;
        red.fixedWidth = 25;
        red.fixedHeight = 100;
        green.parent = widget;
        green.fixedWidth = 25;
        green.fixedHeight = 75;

        widget.draw(context);

        const testImage = canvas.toBuffer('image/png');
        expect(testImage).toMatchImageSnapshot();
      });

      test('Should end align children', () => {
        widget.justifyItems = Container.JustifyItems.Around;
        widget.alignItems = Container.AlignItems.End;

        red.parent = widget;
        red.fixedWidth = 25;
        red.fixedHeight = 100;
        green.parent = widget;
        green.fixedWidth = 25;
        green.fixedHeight = 75;

        widget.draw(context);

        const testImage = canvas.toBuffer('image/png');
        expect(testImage).toMatchImageSnapshot();
      });

      test('Should center align children', () => {
        widget.justifyItems = Container.JustifyItems.Around;
        widget.alignItems = Container.AlignItems.Center;

        red.parent = widget;
        red.fixedWidth = 25;
        red.fixedHeight = 100;
        green.parent = widget;
        green.fixedWidth = 25;
        green.fixedHeight = 75;

        widget.draw(context);

        const testImage = canvas.toBuffer('image/png');
        expect(testImage).toMatchImageSnapshot();
      });

      test('Should auto set the height without parent widget', () => {
        widget.autoSize = true;

        red.parent = widget;
        red.fixedWidth = 100;
        red.fixedHeight = 100;
        green.parent = widget;
        green.fixedWidth = 75;
        green.fixedHeight = 75;

        widget.draw(context);

        expect(widget.container.h).toEqual(100);
      });

      test('Should auto set the height with parent widget', () => {
        const root = new Container();
        root.container = [0, 0, 500, 500];

        widget.parent = root;
        widget.autoSize = true;

        const rootSpy = jest.spyOn(root, '_performLayout');
        const widgetSpy = jest.spyOn(widget, '_performLayout');

        red.parent = widget;
        red.fixedWidth = 100;
        red.fixedHeight = 100;
        green.parent = widget;
        green.fixedWidth = 75;
        green.fixedHeight = 75;

        widget.draw(context);

        expect(widget.container.h).toEqual(100);
        expect(rootSpy).toHaveBeenCalledTimes(2);
        expect(widgetSpy).toHaveBeenCalledTimes(7);
      });
    });

    describe('Vertical children', () => {
      let canvas;
      let context;
      let widget;
      let red;
      let green;
      let blue;

      beforeEach(() => {
        widget = new Container();
        widget.orientation = Container.Orientation.Vertical;
        widget.container = [0, 0, 500, 500];

        red = new Panel();
        red.setColor(Colors.Red);

        green = new Panel();
        green.setColor(Colors.Green);

        blue = new Panel();
        blue.setColor(Colors.Blue);

        canvas = Canvas.createCanvas(500, 500);
        context = canvas.getContext('2d');
      });

      test('Should draw with no children properly', () => {
        widget.draw(context);

        const testImageA = canvas.toBuffer('image/png');
        expect(testImageA).toMatchImageSnapshot();

        context.clearRect(0, 0, canvas.width, canvas.height);
      });

      test('Should position single child properly', () => {
        red.parent = widget;

        widget.draw(context);

        /**
         * red = full size
         */
        const testImageA = canvas.toBuffer('image/png');
        expect(testImageA).toMatchImageSnapshot();

        context.clearRect(0, 0, canvas.width, canvas.height);
      });

      test('Should handle children when no space is left', () => {
        red.parent = widget;
        green.parent = widget;
        green.fixedHeight = 1000;
        widget.draw(context);

        /**
         * red = full size
         */
        const testImageA = canvas.toBuffer('image/png');
        expect(testImageA).toMatchImageSnapshot();

        context.clearRect(0, 0, canvas.width, canvas.height);
      });

      test('Should position single manually positioned child properly', () => {
        const shade = new Shade();
        shade.parent = widget;

        widget.draw(context);

        /**
         * red = full size
         */
        const testImageA = canvas.toBuffer('image/png');
        expect(testImageA).toMatchImageSnapshot();

        context.clearRect(0, 0, canvas.width, canvas.height);
      });

      test('Should position children evenly', () => {
        red.parent = widget;
        green.parent = widget;

        widget.draw(context);

        /**
         * red = 1 half
         * green = 1 half
         */
        const testImageA = canvas.toBuffer('image/png');
        expect(testImageA).toMatchImageSnapshot(); // 50/50

        context.clearRect(0, 0, canvas.width, canvas.height);

        blue.parent = widget;

        widget.draw(context);

        /**
         * red = 1 thirds
         * green = 1 thrid
         * blue = 1 thrid
         */
        const testImageB = canvas.toBuffer('image/png');
        expect(testImageB).toMatchImageSnapshot(); // 33/33/33
      });

      test('Should position children evenly ordered by the order property', () => {
        red.parent = widget;
        red.order = 3;
        green.parent = widget;
        green.order = 1;
        blue.parent = widget;
        blue.order = 2;

        widget.draw(context);

        /**
         * Order = green, blue, red
         */
        const testImage = canvas.toBuffer('image/png');
        expect(testImage).toMatchImageSnapshot();
      });

      test('Should size childred based on the grow property', () => {
        red.parent = widget;
        red.grow = 2;
        green.parent = widget;

        widget.draw(context);

        /**
         * red = 2 thirds
         * green = 1 thrid
         */
        const testImage = canvas.toBuffer('image/png');
        expect(testImage).toMatchImageSnapshot();
      });

      test('Should start justify children', () => {
        widget.justifyItems = Container.JustifyItems.Start;

        red.parent = widget;
        red.fixedWidth = 25;
        green.parent = widget;
        green.fixedWidth = 25;

        widget.draw(context);

        const testImage = canvas.toBuffer('image/png');
        expect(testImage).toMatchImageSnapshot();
      });

      test('Should center justify children', () => {
        widget.justifyItems = Container.JustifyItems.Center;

        red.parent = widget;
        red.fixedWidth = 25;
        green.parent = widget;
        green.fixedWidth = 25;

        widget.draw(context);

        const testImage = canvas.toBuffer('image/png');
        expect(testImage).toMatchImageSnapshot();
      });

      test('Should end justify children', () => {
        widget.justifyItems = Container.JustifyItems.End;

        red.parent = widget;
        red.fixedWidth = 25;
        green.parent = widget;
        green.fixedWidth = 25;

        widget.draw(context);

        const testImage = canvas.toBuffer('image/png');
        expect(testImage).toMatchImageSnapshot();
      });

      test('Should add space around justify children', () => {
        widget.justifyItems = Container.JustifyItems.Around;

        red.parent = widget;
        red.fixedWidth = 25;
        green.parent = widget;
        green.fixedWidth = 25;

        widget.draw(context);

        const testImage = canvas.toBuffer('image/png');
        expect(testImage).toMatchImageSnapshot();
      });

      test('Should add space between justify children', () => {
        widget.justifyItems = Container.JustifyItems.Between;

        red.parent = widget;
        red.fixedWidth = 25;
        green.parent = widget;
        green.fixedWidth = 25;

        widget.draw(context);

        const testImage = canvas.toBuffer('image/png');
        expect(testImage).toMatchImageSnapshot();
      });

      test('Should start align children', () => {
        widget.justifyItems = Container.JustifyItems.Around;
        widget.alignItems = Container.AlignItems.Start;

        red.parent = widget;
        red.fixedWidth = 25;
        red.fixedHeight = 100;
        green.parent = widget;
        green.fixedWidth = 25;
        green.fixedHeight = 75;

        widget.draw(context);

        const testImage = canvas.toBuffer('image/png');
        expect(testImage).toMatchImageSnapshot();
      });

      test('Should end align children', () => {
        widget.justifyItems = Container.JustifyItems.Around;
        widget.alignItems = Container.AlignItems.End;

        red.parent = widget;
        red.fixedWidth = 25;
        red.fixedHeight = 100;
        green.parent = widget;
        green.fixedWidth = 25;
        green.fixedHeight = 75;

        widget.draw(context);

        const testImage = canvas.toBuffer('image/png');
        expect(testImage).toMatchImageSnapshot();
      });

      test('Should center align children', () => {
        widget.justifyItems = Container.JustifyItems.Around;
        widget.alignItems = Container.AlignItems.Center;

        red.parent = widget;
        red.fixedWidth = 25;
        red.fixedHeight = 100;
        green.parent = widget;
        green.fixedWidth = 25;
        green.fixedHeight = 75;

        widget.draw(context);

        const testImage = canvas.toBuffer('image/png');
        expect(testImage).toMatchImageSnapshot();
      });

      test('Should auto set the width without parent widget', () => {
        widget.autoSize = true;

        red.parent = widget;
        red.fixedWidth = 100;
        red.fixedHeight = 100;
        green.parent = widget;
        green.fixedWidth = 75;
        green.fixedHeight = 75;

        widget.draw(context);

        expect(widget.container.w).toEqual(100);
      });

      test('Should auto set the width with parent widget', () => {
        const root = new Container();
        root.container = [0, 0, 500, 500];

        widget.parent = root;
        widget.autoSize = true;

        const rootSpy = jest.spyOn(root, '_performLayout');
        const widgetSpy = jest.spyOn(widget, '_performLayout');

        red.parent = widget;
        red.fixedWidth = 100;
        red.fixedHeight = 100;
        green.parent = widget;
        green.fixedWidth = 75;
        green.fixedHeight = 75;

        widget.draw(context);

        expect(widget.container.w).toEqual(100);
        expect(rootSpy).toHaveBeenCalledTimes(2);
        expect(widgetSpy).toHaveBeenCalledTimes(7);
      });
    });

    describe('Stacked children', () => {
      test('should stack children', async () => {
        const widget = new Container();
        widget.padding = 10;
        widget.container = [0, 0, 500, 500];
        widget.orientation = Container.Orientation.Stack;

        const childA = new Image(widget);
        childA.src = TEST_IMG;

        const childB = new Panel();
        childB.parent = widget;

        const windowCanvas = Canvas.createCanvas(500, 500);
        const windowContext = windowCanvas.getContext('2d');

        await waitForTrue(() => !childA.loading);
        widget.draw(windowContext);

        const testImage = windowCanvas.toBuffer('image/png');
        expect(testImage).toMatchImageSnapshot();
      });

      test('should stack ordered children', async () => {
        const widget = new Container();
        widget.padding = 10;
        widget.container = [0, 0, 500, 500];
        widget.orientation = Container.Orientation.Stack;

        const childA = new Image(widget);
        childA.src = TEST_IMG;
        childA.order = 2;

        const childB = new Panel();
        childB.parent = widget;
        childA.order = 1;

        const windowCanvas = Canvas.createCanvas(500, 500);
        const windowContext = windowCanvas.getContext('2d');

        await waitForTrue(() => !childA.loading);
        widget.draw(windowContext);

        const testImage = windowCanvas.toBuffer('image/png');
        expect(testImage).toMatchImageSnapshot();
      });
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
