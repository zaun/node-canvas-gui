import {
  expect,
  test,
} from '@jest/globals';
import Image from '../src/Image.js';

describe('Testing the Image class', () => {
  test('Should create a valid widget', () => {
    const widget = new Image();
    expect(widget).toBeDefined();
  });
});
