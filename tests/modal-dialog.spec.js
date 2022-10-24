import {
  beforeEach,
  expect,
  test,
} from '@jest/globals';
import ModalDialog from '../src/ModalDialog.js';

describe('Testing the ModalDialog class', () => {
  beforeEach(() => {
    global.window = {
      width: 100,
      height: 100,
    };
  });

  test('Should create a valid widget', () => {
    const widget = new ModalDialog();
    expect(widget).toBeDefined();
  });
});
