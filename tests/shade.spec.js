import {
  expect,
  test,
} from '@jest/globals';
import Shade from '../src/Shade.js';

describe('Testing the Shade class', () => {
  beforeEach(() => {
    global.window = {
      width: 100,
      height: 100,
    };
  });

  test('Should create a valid widget', () => {
    const widget = new Shade();
    expect(widget).toBeDefined();
  });
});
