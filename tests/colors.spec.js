import {
  expect,
  test,
} from '@jest/globals';
import Colors from '../src/Colors.js';

describe('Testing the Colors class', () => {
  test('Should have staic colors', () => {
    expect(Colors.White).toEqual('#ffffff');
    expect(Colors.Black).toEqual('#000000');
    expect(Colors.Transparent).toEqual('#00000000');

    expect(Object.keys(Colors)).toContain('Blue');
    expect(Object.keys(Colors)).toContain('Red');
    expect(Object.keys(Colors)).toContain('Green');
    expect(Object.keys(Colors)).toContain('Yellow');
    expect(Object.keys(Colors)).toContain('Gray');
  });

  test('Should make a color darker', () => {
    const stepA = Colors.darker(Colors.White);
    const stepB = Colors.darker(stepA);
    const stepC = Colors.darker(Colors.White, 2);
    const stepD = Colors.darker(Colors.White, 3);
    const stepE = Colors.darker(stepD);
    const stepF = Colors.darker(Colors.White, 4);
    const stepG = Colors.darker(Colors.White, 5);

    expect(stepA).toEqual('#bfbfbf');
    expect(stepB).toEqual('#8f8f8f');
    expect(stepC).toEqual('#808080');
    expect(stepD).toEqual('#404040');
    expect(stepE).toEqual('#303030');
    expect(stepF).toEqual('#000000');
    expect(stepG).toEqual(stepF);
  });

  test('Should make a color lighter', () => {
    const stepA = Colors.lighter(Colors.Black);
    const stepB = Colors.lighter(stepA);
    const stepC = Colors.lighter(Colors.Black, 2);
    const stepD = Colors.lighter(Colors.Black, 3);
    const stepE = Colors.lighter(stepD);
    const stepF = Colors.lighter(Colors.Black, 4);
    const stepG = Colors.lighter(Colors.Black, 5);

    expect(stepA).toEqual('#404040');
    expect(stepB).toEqual('#707070');
    expect(stepC).toEqual('#808080');
    expect(stepD).toEqual('#bfbfbf');
    expect(stepE).toEqual('#cfcfcf');
    expect(stepF).toEqual('#ffffff');
    expect(stepG).toEqual(stepF);
  });

  test('should pick correct foreground color', () => {
    expect(Colors.foregroundFor(Colors.Black)).toEqual(Colors.White);
    expect(Colors.foregroundFor(Colors.White)).toEqual(Colors.Black);
    expect(Colors.foregroundFor(Colors.Red)).toEqual(Colors.White);
    expect(Colors.foregroundFor(Colors.Yellow)).toEqual(Colors.Black);
  });
});
