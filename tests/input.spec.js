import {
  expect,
  test,
} from '@jest/globals';
import Input from '../src/Input.js';

describe('Testing the Input class', () => {
  test('Should create a valid widget', () => {
    const widget = new Input();
    expect(widget).toBeDefined();
  });
});
