import {
  expect,
  test,
} from '@jest/globals';
import EventSource from '../src/EventSource.js';

describe('Testing the EventSource class', () => {
  test('Should create a source theme', () => {
    const source = new EventSource();
    expect(source).toBeDefined();
  });
});
