/* eslint-disable no-await-in-loop */
/* eslint-disable import/no-extraneous-dependencies */

import sdl from '@kmamal/sdl';
import { setTimeout } from 'timers/promises';
import Canvas from 'canvas';
import {
  Container,
  ModalDialog,
  Colors,
  Panel,
  Label,
  Input,
  Button,
} from '../../src/index.js';

import createButtonHelp from './buttonHelp.js';
import createContainerHelp from './containerHelp.js';
import createImageHelp from './imageHelp.js';
import createLabelHelp from './labelHelp.js';
import createListHelp from './listHelp.js';
import createSpinnerHelp from './spinnerHelp.js';
import createSwitchHelp from './switchHelp.js';
import creatTextHelp from './textHelp.js';

// Widget.debug = true;

// Create the SDL application window
global.window = sdl.video.createWindow({
  width: 1280,
  height: 720,
  resizable: false,
  vsync: true,
  accelerated: true,
});
global.window.setTitle('node-canvas-gui example');

// Setup the node-canvas framebuffer
const { width, height } = global.window;
const windowCanvas = Canvas.createCanvas(width, height);
const windowContext = windowCanvas.getContext('2d');

const makeMenuButton = (label, fn) => {
  const btn = new Button(null, label);
  btn.text = label;

  if (fn) {
    btn.onMouseClick = fn;
  }
  return btn;
};

const makeCenter = (widget) => {
  const h = new Container();
  const v = new Container();
  v.orientation = Container.Orientation.Vertical;
  v.fixedWidth = 300;

  h.addChild(new Container());
  h.addChild(v);
  h.addChild(new Container());

  v.addChild(new Container());
  v.addChild(widget);
  v.addChild(new Container());

  return h;
};

// const root = new Container();
// const panel = new Panel(root);
// panel.radii = 50;
// panel.fixedWidth = 100;
// const panelB = new Panel(root);
// panelB.radii = 50;
// panelB.fixedHeight = 100;
// const panelC = new Panel(root);
// panelC.radii = 50;

// Setup the root Container for the GUI
const root = new Container(null, 'Root');
root.orientation = Container.Orientation.Horizontal;
root.eventSource = global.window;
root.container = [0, 0, global.window.width, global.window.height];

// Add a Container for menu
const menu = new Container(root, 'Menu');
menu.orientation = Container.Orientation.Vertical;
menu.fixedWidth = global.window.width / 6;
menu.padding = 5;

// Add a panel for display
const background = new Panel(root, 'Display Background');
background.padding = 10;
const display = new Container(background, 'Display');

// Add widget examples
menu.addChild(makeMenuButton('Button', () => {
  display.removeChildren();
  const buttonScreen = createButtonHelp();
  display.addChild(buttonScreen);
}));

menu.addChild(makeMenuButton('Switch', () => {
  display.removeChildren();
  const containerScreen = createSwitchHelp();
  display.addChild(containerScreen);
}));

menu.addChild(makeMenuButton('Container', () => {
  display.removeChildren();
  const containerScreen = createContainerHelp();
  display.addChild(containerScreen);
}));

menu.addChild(makeMenuButton('Spinner', () => {
  display.removeChildren();
  const containerScreen = createSpinnerHelp();
  display.addChild(containerScreen);
}));

menu.addChild(makeMenuButton('Image', () => {
  display.removeChildren();
  const containerScreen = createImageHelp();
  display.addChild(containerScreen);
}));

menu.addChild(makeMenuButton('Label', () => {
  display.removeChildren();
  const containerScreen = createLabelHelp();
  display.addChild(containerScreen);
}));

menu.addChild(makeMenuButton('List', () => {
  display.removeChildren();
  const containerScreen = createListHelp();
  display.addChild(containerScreen);
}));

menu.addChild(makeMenuButton('Text', () => {
  display.removeChildren();
  const containerScreen = creatTextHelp();
  display.addChild(containerScreen);
}));

menu.addChild(makeMenuButton('Panel', () => {
  display.removeChildren();

  const tmp = new Panel();
  tmp.setColor(Colors.Gray);

  display.addChild(makeCenter(tmp));
}));

menu.addChild(makeMenuButton('Input', () => {
  display.removeChildren();

  const tmp = new Input();

  display.addChild(makeCenter(tmp));
}));

menu.addChild(makeMenuButton('Modal Dialog', () => {
  display.removeChildren();

  const dialog = new ModalDialog(null, 'test');
  const c = new Container();
  c.orientation = Container.Orientation.Vertical;
  dialog.addChild(c);

  const l = new Label();
  l.text = 'This a a modal dialog box. The context\nof the box are completly user controlled.';
  // l.backgroundColor = '#aa0000';
  l.fixedHeight = 140;
  c.addChild(l);

  const h = new Container();
  c.addChild(h);

  const b = new Button();
  b.text = 'Close';
  b.onMouseClick = () => {
    display.removeChild(dialog);
  };

  h.addChild(new Container());
  h.addChild(new Container());
  h.addChild(b);

  const tmp = new Button();
  tmp.text = 'Open ModalDialog';
  tmp.fixedHeight = 50;
  tmp.onMouseClick = () => {
    display.addChild(dialog);
  };

  display.addChild(makeCenter(tmp));
}));

const main = async () => {
  while (!global.window.destroyed) {
    windowContext.clearRect(0, 0, width, height);

    root.draw(windowContext);
    const buffer = windowCanvas.toBuffer('raw');
    global.window.render(width, height, width * 4, 'bgra32', buffer);

    await setTimeout(10);
  }
};

// Run the window's loop
main();
