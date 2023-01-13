import {
  expect,
  test,
} from '@jest/globals';
import ScrollView from '../src/ScrollView.js';

describe('Testing the ScrollView class', () => {
  beforeEach(() => {
    global.window = {
      width: 100,
      height: 100,
    };
  });

  test('Should create a valid widget', () => {
    const widget = new ScrollView();
    expect(widget).toBeDefined();
  });
});
