import {
  expect,
  test,
} from '@jest/globals';
import Container from '../src/Container.js';

describe('Testing the Container class', () => {
  test('Should create a valid widget', () => {
    const widget = new Container();
    expect(widget).toBeDefined();
  });
});
