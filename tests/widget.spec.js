import {
  expect,
  test,
} from '@jest/globals';
import Container from '../src/Container.js';
import Widget from '../src/Widget.js';

describe('Testing the base Widget class', () => {
  test('Static debug should be false', async () => {
    expect(Widget.debug).toEqual(false);
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

  test('Should have expected defaults with no parent and no name', async () => {
    const widget = new Widget();

    expect(widget.parent).toEqual(null);
    expect(widget.name).toMatch(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/);
    expect(widget.visible).toEqual(true);
    expect(widget.container).toEqual({
      h: 0, w: 0, x: 0, y: 0,
    });
    expect(widget.body).toEqual({
      h: 0, w: 0, x: 0, y: 0,
    });
    expect(widget.padding).toEqual({
      t: 0, b: 0, l: 0, r: 0,
    });
  });

  test('Should have set a fixed width and height', async () => {
    const widget = new Widget();
    widget.fixedHeight = 20;
    widget.fixedWidth = 20;

    expect(widget.parent).toEqual(null);
    expect(widget.name).toMatch(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/);
    expect(widget.visible).toEqual(true);
    expect(widget.container).toEqual({
      h: 20, w: 20, x: 0, y: 0,
    });
    expect(widget.body).toEqual({
      h: 20, w: 20, x: 0, y: 0,
    });
    expect(widget.padding).toEqual({
      t: 0, b: 0, l: 0, r: 0,
    });
  });

  test('Should adjust body size with padding', async () => {
    const widget = new Widget();
    widget.fixedHeight = 20;
    widget.fixedWidth = 20;
    widget.padding = [1, 2, 3, 4];

    expect(widget.parent).toEqual(null);
    expect(widget.name).toMatch(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/);
    expect(widget.visible).toEqual(true);
    expect(widget.container).toEqual({
      h: 20, w: 20, x: 0, y: 0,
    });
    expect(widget.body).toEqual({
      h: 17, w: 13, x: 3, y: 1,
    });
    expect(widget.padding).toEqual({
      t: 1, b: 2, l: 3, r: 4,
    });
  });

  test('Should have expected defaults with parent and name', async () => {
    const root = new Container();
    const widget = new Widget(root, 'FOO');

    expect(widget.parent).toEqual(root);
    expect(widget.name).toEqual('FOO');
    expect(widget.visible).toEqual(true);
    expect(widget.container).toEqual({
      h: 0, w: 0, x: 0, y: 0,
    });
    expect(widget.body).toEqual({
      h: 0, w: 0, x: 0, y: 0,
    });
    expect(widget.padding).toEqual({
      t: 0, b: 0, l: 0, r: 0,
    });
  });

  test('Should have a container size of the parent\'s body', async () => {
    const root = new Container();
    root.fixedHeight = 20;
    root.fixedWidth = 20;
    root.padding = [1, 2, 3, 4];

    const widget = new Widget(root);

    expect(widget.parent).toEqual(root);
    expect(widget.container).toEqual({
      h: 17, w: 13, x: 3, y: 1,
    });
    expect(widget.body).toEqual({
      h: 17, w: 13, x: 3, y: 1,
    });
  });
});
