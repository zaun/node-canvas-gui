import {
  expect,
  test,
} from '@jest/globals';
import Button from '../src/Button.js';

describe('Testing the Button class', () => {
  test('Should create a valid widget', () => {
    const widget = new Button();
    expect(widget).toBeDefined();
  });
});
