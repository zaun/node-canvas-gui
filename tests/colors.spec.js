import {
  expect,
  test,
} from '@jest/globals';
import Colors from '../src/Colors.js';

describe('Testing the Colors class', () => {
  test('Should create a valid theme', () => {
    const colors = new Colors();
    expect(colors).toBeDefined();
  });
});
