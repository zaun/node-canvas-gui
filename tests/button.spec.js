import {
  expect,
  jest,
  test,
} from '@jest/globals';
import jestImageSnapshot from 'jest-image-snapshot';
import Canvas from 'canvas';
import Button from '../src/Button.js';
import Container from '../src/Container.js';
import Widget from '../src/Widget.js';

const toMatchImageSnapshot = jestImageSnapshot.configureToMatchImageSnapshot({
  customSnapshotsDir: './tests/testImages',
});
expect.extend({ toMatchImageSnapshot });

describe('Testing the Button class', () => {
  beforeEach(() => {
    Widget.debug = false;
    Button.testing = true;
  });

  afterEach(() => {
    Button.testing = false;
    jest.clearAllMocks();
  });

  describe('Button static', () => {
    test('Static debug should be false', async () => {
      expect(Button.debug).toEqual(false);
      Button.debug = true;
      expect(Button.debug).toEqual(true);
      Button.debug = false;
      expect(Button.debug).toEqual(false);
    });

    test('Static have emuns', async () => {
      expect(Button.Mode).toBeDefined();
      expect(Object.keys(Button.Mode)).toHaveLength(3);
      expect(() => {
        Button.Mode.foo = 99;
      }).toThrow();

      expect(Button.Size).toBeDefined();
      expect(Object.keys(Button.Size)).toHaveLength(3);
      expect(() => {
        Button.Size.foo = 99;
      }).toThrow();
    });
  });

  describe('Button contrustor tests', () => {
    test('Should have expected defaults with no parent and no name', async () => {
      const widget = new Button();

      expect(widget.parent).toEqual(null);
      expect(widget.name).toMatch(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/);
    });

    test('Should have expected defaults with parent and name', async () => {
      const root = new Container();
      const widget = new Button(root, 'FOO');

      expect(widget.parent).toEqual(root);
      expect(widget.name).toEqual('FOO');
    });

    test('Should error if not passing a Widget as the parent', async () => {
      expect(() => new Button(123)).toThrow(Error);
    });

    test('Should error if not passing a Container as the parent', async () => {
      const widget = new Widget();
      expect(() => new Button(widget)).toThrow(Error);
    });

    test('Should not error is not passing a null as the parent', async () => {
      expect(() => new Button(null)).not.toThrow(Error);
    });

    test('Should prevent extensions when not testing', async () => {
      Button.testing = false;
      const widget = new Button();
      expect(() => {
        widget.foo = true;
      }).toThrow(Error);
    });
  });

  describe('Button property tests', () => {
    test('Should set mode', () => {
      const widget = new Button();

      const localSpy = jest.spyOn(widget, '_performLayout');

      widget.mode = Button.Mode.Outline;

      expect(widget.mode).toEqual(Button.Mode.Outline);
      expect(localSpy).toHaveBeenCalledTimes(1);
    });

    test('Should set mode and not call preformLayout for same value', () => {
      const widget = new Button();

      const localSpy = jest.spyOn(widget, '_performLayout');

      expect(widget.mode).toEqual(Button.Mode.Default);

      widget.mode = Button.Mode.Default;

      expect(localSpy).toHaveBeenCalledTimes(0);
    });

    test('Should not set mode to invalid value', () => {
      const widget = new Button();

      expect(() => {
        widget.mode = 'FOO';
      }).toThrow();
    });
  });

  describe('Button drawing', () => {
    let root;
    let canvas;
    let context;

    beforeEach(() => {
      root = new Container();
      root.container = [0, 0, 500, 500];
      canvas = Canvas.createCanvas(500, 500);
      context = canvas.getContext('2d');
    });

    test('Should draw default button', () => {
      const widget = new Button(root);

      widget.draw(context);

      const testImageA = canvas.toBuffer('image/png');
      expect(testImageA).toMatchImageSnapshot();

      expect(widget.container.h).toEqual(38);
    });

    test('Should draw small default button', () => {
      const widget = new Button(root);
      widget.setSize(Button.Size.Small);
      widget.text = 'FOO';

      widget.draw(context);

      const testImageA = canvas.toBuffer('image/png');
      expect(testImageA).toMatchImageSnapshot();

      expect(widget.container.h).toEqual(31);
    });

    test('Should draw medium default button', () => {
      const widget = new Button(root);
      widget.setSize(Button.Size.Medium);
      widget.text = 'FOO';

      widget.draw(context);

      const testImageA = canvas.toBuffer('image/png');
      expect(testImageA).toMatchImageSnapshot();

      expect(widget.container.h).toEqual(38);
    });

    test('Should draw large default button', () => {
      const widget = new Button(root);
      widget.setSize(Button.Size.Large);
      widget.text = 'FOO';

      widget.draw(context);

      const testImageA = canvas.toBuffer('image/png');
      expect(testImageA).toMatchImageSnapshot();

      expect(widget.container.h).toEqual(48);
    });
  });
});
