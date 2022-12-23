import { promises as fs } from 'fs';
import {
  expect,
  test,
} from '@jest/globals';
import * as gui from '../src/index.js';

describe('Testing the module', () => {
  test('should have all the widgets', async () => {
    const files = await fs.readdir('./src/');

    // Remove index.js Internal.js and EventSource.js from the count
    const widgetCount = files.length - 3;

    expect(Object.keys(gui).filter(
      (v) => v[0] === v[0].toLocaleUpperCase(),
    )).toHaveLength(widgetCount);
  });
});
