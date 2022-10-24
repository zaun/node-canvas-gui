import {
  expect,
  test,
} from '@jest/globals';
import Panel from '../src/Panel.js';

describe('Testing the Panel class', () => {
  test('Should create a valid widget', () => {
    const widget = new Panel();
    expect(widget).toBeDefined();
  });
});
