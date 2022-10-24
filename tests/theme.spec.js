import {
  expect,
  test,
} from '@jest/globals';
import Theme from '../src/Theme.js';

describe('Testing the Theme class', () => {
  test('Should create a valid theme', () => {
    const theme = new Theme();
    expect(theme).toBeDefined();
  });
});
