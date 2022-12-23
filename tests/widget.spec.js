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
    Widget.testing = true;
  });

  afterEach(() => {
    Widget.testing = false;
    jest.clearAllMocks();
  });

  test('Static debug should be false', async () => {
    expect(Widget.debug).toEqual(false);
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
});
