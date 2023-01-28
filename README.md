# node-canvas-gui
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Build](https://github.com/zaun/node-canvas-gui/actions/workflows/node.js.yml/badge.svg)

Offering a set of UI elements to be used with the node-canvas and node-sdl.

## Quick Start Example (node-canvas and node-sdl)

```
import Canvas from 'canvas';
import sdl from '@kmamal/sdl';
import { setTimeout } from 'timers/promises';

import {
  Colors,
  Container,
  Panel,
  Label,
  Button,
} from 'node-canvas-gui';

// Create window
global.window = sdl.video.createWindow({
  width: 1280,
  height: 720,
  resizable: false,
  vsync: true,
  accelerated: true,
});

// Setup the canvas
const { width, height } = global.window;
const windowCanvas = Canvas.createCanvas(width, height);
const windowContext = windowCanvas.getContext('2d');

// Root container
const root = new Container();
root.orientation = Container.Orientation.Vertical;
root.alignItems = Container.AlignItems.Center;
root.eventSource = global.window;
root.container = [0, 0, global.window.width, global.window.height];
root.padding = 10;

// Top Panel, Hello World
const topPanel = new Panel(root);
topPanel.setColor(Colors.Blue);
const label = new Label(topPanel);
label.text = 'Hello World';

// Bottom Panel
const bottomPanel = new Panel(root);
topPanel.setColor(Colors.Yellow);
const button = new Button(bottomPanel);
button.fixedWidth = 120;
button.text = 'Quit';
button.onMouseClick = () => {
  global.window.destroy();
};

// Main loop
const main = async () => {
  while (!global.window.destroyed) {
    windowContext.clearRect(0, 0, width, height);

    root.draw(windowContext);
    const buffer = windowCanvas.toBuffer('raw');
    global.window.render(width, height, width * 4, 'bgra32', buffer);

    await setTimeout(0);
  }
};

main();
```
