import {
  expect,
  test,
} from '@jest/globals';
import Label from '../src/Label.js';

describe('Testing the Label class', () => {
  test('Should create a valid widget', () => {
    const widget = new Label();
    expect(widget).toBeDefined();
  });
});
