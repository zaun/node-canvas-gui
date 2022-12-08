/* eslint-disable no-await-in-loop */
/* eslint-disable import/no-extraneous-dependencies */

import sdl from '@kmamal/sdl';
import { setTimeout } from 'timers/promises';
import Canvas from 'canvas';
import {
  Widget,
  Container,
  ModalDialog,
  Theme,
  Panel,
  Label,
  // Button,
  Image,
  Input,
  makeLabelButton,
  List,
  // Text,
} from '../src/index.js';

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
  const btn = makeLabelButton(label);
  btn.fixedHeight = 40;

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

// Setup the root Container for the GUI
const root = new Container(null, 'Root');
root.orientation = Container.Orientation.Horizontal;
root.eventSource = global.window;
root.setContainer(0, 0, global.window.width, global.window.height);
root.theme = Theme.Themes.Eagle;

// const tmp = new Text(root, 'test');
// tmp.setPadding(10, 10, 10, 10);
// tmp.text = `
// # Header 1

// ## Header 2

// ### Header 3

// #### Header 4

// ##### Header 5

// ###### Header 6

// Here is a paragraph.
// Here is an *em tag*.
// Here is a **bold tag**.
// Here is a __underline tag__.
// Here is a ***em and bold tag***.
// Here is a **__bold and underline tag__**.
// Here is an ***__em bold and underline tag__***.
// Here is \`\`inline code\`\`.

// ---

// New paragraph starts here.

// > Dorothy followed her through many of the beautiful rooms in her castle.

// > Dorothy followed her through many of the beautiful rooms in her castle.
// > The Witch bade her clean the pots and kettles and sweep the floor and
//   keep the fire fed with wood.

// > warn <
// > Dorothy followed her through many of the beautiful rooms in her castle.
// >
// > The Witch bade her clean the pots and kettles and sweep the floor and
//   keep the fire fed with wood.

// > info <
// > Testing

// Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test
// Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test
// Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test
// Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test
// Test Test Test Test Test Test Test Test Test Test Test Test

// Standard Ordered List:

// 1. First Item
// 1. Second Item
// 1. Third Item

// Ordered List starting at 10:

// 10. First Item
// 10. Second Item
// 10. Third Item

// Unordered List:

// * First Item
// * Second Item
// * Third Item

// \`\`\`json
// {
//   "a": "Apples",
//   "b": "Bananas",
//   "c": "Cantalopes"
// }
// \`\`\`
// `;

// Add a Container for menu
const menu = new Container(root, 'Menu');
menu.orientation = Container.Orientation.Vertical;
menu.fixedWidth = global.window.width / 6;
menu.setPadding(0, 0, 0, 10);

// Add a panel for display
const background = new Panel(root, 'Display Background');
background.setPadding(10, 10, 10, 10);
const display = new Container(background, 'Display');

// Add widget examples
menu.addChild(makeMenuButton('Button', () => {
  display.removeChildren();

  const tmp = new Container();
  tmp.orientation = Container.Orientation.Vertical;

  const lblCount = new Label(tmp);
  lblCount.text = 0;

  const btns = new Container(tmp, 'Button Bar');
  btns.fixedHeight = 50;

  const btnAdd = makeLabelButton('+1', btns);
  btnAdd.onMouseClick = () => {
    lblCount.text = (parseInt(lblCount.text, 10) + 1);
  };

  const spacer = new Widget(null, 'Spacer');
  btns.addChild(spacer);

  const btnSub = makeLabelButton('-1', btns);
  btnSub.onMouseClick = () => {
    lblCount.text = (parseInt(lblCount.text, 10) - 1);
  };

  display.addChild(makeCenter(tmp));
}));

menu.addChild(makeMenuButton('Container', () => {
  display.removeChildren();
}));

menu.addChild(makeMenuButton('Image', () => {
  display.removeChildren();

  const tmp = new Image();
  tmp.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/SNice.svg/768px-SNice.svg.png';

  display.addChild(makeCenter(tmp));
}));

menu.addChild(makeMenuButton('Label', () => {
  display.removeChildren();

  const tmp = new Container();
  tmp.orientation = Container.Orientation.Vertical;
  const lblA = new Label();
  const lblB = new Label();
  lblA.text = 'This is a label';
  lblB.text = 'This is a multi-line label\nthat has centered text.';
  tmp.addChild(lblA);
  tmp.addChild(lblB);

  const spacerA = new Widget();
  spacerA.fixedWidth = 100;
  const spacerB = new Widget();
  spacerB.fixedWidth = 100;

  const buttonBar = new Container(null, 'Button Bar');
  buttonBar.orientation = Container.Orientation.Vertical;

  let row = new Container(buttonBar);
  row.fixedHeight = 45;
  let rows = 1;
  Object.keys(Label.Fonts).forEach((font, idx) => {
    if (idx % 5 === 0) {
      row = new Container(buttonBar);
      row.fixedHeight = 45;
      rows += 1;
    }
    const btnFontA = makeLabelButton(font, row);
    btnFontA.onMouseClick = () => {
      lblA.font = Label.Fonts[font];
      lblB.font = Label.Fonts[font];
    };
  });
  buttonBar.fixedHeight = rows * 45;

  const v = new Container();
  v.orientation = Container.Orientation.Vertical;
  v.addChild(new Widget());
  v.addChild(tmp);
  v.addChild(buttonBar);

  const h = new Container();
  h.addChild(spacerA);
  h.addChild(v);
  h.addChild(spacerA);

  display.addChild(h);
}));

menu.addChild(makeMenuButton('List', () => {
  display.removeChildren();

  const list = new List();
  list.itemHeight = 30;
  list.items = [
    'Yellow',
    'Yellow Green',
    'Violet Red',
    'Violet',
    'Wheat',
    'Turquoise',
    'Tomato',
    'Thistle',
    'Tan',
    'Steel Blue',
    'Spring Green',
    'Slate Gray',
    'Sky Blue',
    'Sienna',
    'Sea Green',
    'Salmon',
    'Orange Red',
    'Navy Blue',
    'Lime Green',
    'Light Sea Green',
    'Hot Pink',
    'Dark Green',
    'Blue',
    'Black',
    'Brown',
    'Alice Blue',
    'Antique White',
    'Aquamarine',
    'Azure',
    'Blanched Almond',
    'Blue Violet',
    'Burlywood',
    'Cadet Blue',
    'Chartreuse',
    'Chocolate',
    'Coral',
    'Cornflower Blue',
    'Cornsilk',
    'Cyan',
    'Dark Goldenrod',
    'Dark Olive Green',
    'Deep Pink',
    'Deep Sky Blue',
    'Dim Gray',
    'Dodger Blue',
    'Firebrick',
    'Forest Green',
    'Gold',
    'Gray',
    'Indian Red',
  ];
  list.itemCreate = (i) => {
    const l = new Label();
    l.text = i;
    l.fontSize = 20;
    return l;
  };

  const p = new Panel(null, 'test');
  p.addChild(list);

  const h = new Container();
  h.orientation = Container.Orientation.Horizontal;
  h.addChild(new Widget());
  h.addChild(p);
  h.addChild(new Widget());
  h.setPadding(40, 40, 0, 0);

  display.addChild(h);
}));

menu.addChild(makeMenuButton('Panel', () => {
  display.removeChildren();

  const tmp = new Panel();

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

  const b = makeLabelButton('Close');
  b.onMouseClick = () => {
    display.removeChild(dialog);
  };

  h.addChild(new Container());
  h.addChild(new Container());
  h.addChild(b);

  const tmp = makeLabelButton('Open ModalDialog');
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
