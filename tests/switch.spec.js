import {
  expect,
  test,
} from '@jest/globals';
import Switch from '../src/Switch.js';

describe('Testing the Switch class', () => {
  beforeEach(() => {
    global.window = {
      width: 100,
      height: 100,
    };
  });

  test('Should create a valid widget', () => {
    const widget = new Switch();
    expect(widget).toBeDefined();
  });
});
