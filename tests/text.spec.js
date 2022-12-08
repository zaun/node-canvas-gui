import {
  expect,
  test,
} from '@jest/globals';
import Text from '../src/Text.js';

describe('Testing the Text class', () => {
  test('Should create a valid widget', () => {
    const widget = new Text();
    expect(widget).toBeDefined();
  });
});
