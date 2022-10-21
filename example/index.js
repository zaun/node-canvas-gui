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
  Button,
  Image,
  makeLabelButton,
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
let { width, height } = global.window;
let windowCanvas = Canvas.createCanvas(width, height);
let windowContext = windowCanvas.getContext('2d');

const makeMenuButton = (label, fn) => {
  const btn = new Button();
  btn.fixedHeight = 50;

  const lbl = new Label();
  lbl.text = label;
  btn.addChild(lbl);

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
}

// Setup the root Container for the GUI
const root = new Container(null, 'Root');
root.orientation = Container.Orientation.Horizontal;
root.eventSource = global.window;
root.setContainer(0, 0, global.window.width, global.window.height);

// Add a Container for menu
const menu = new Container(root, 'Menu');
menu.orientation = Container.Orientation.Vertical;
menu.fixedWidth = global.window.width / 5;

// Add a panel for display
const background = new Panel(root, 'Display Background');
background.theme = Theme.Colors.Gray;
background.setPadding(10, 10, 10, 10);
const display = new Container(background, 'Display');
display.theme = Theme.Colors.Blue;

// Add widget examples
menu.addChild(makeMenuButton('Button', () => {
  display.removeChildren();

  const tmp = new Container();
  tmp.orientation = Container.Orientation.Vertical;

  const lblCount = new Label(tmp);
  lblCount.text = 0;

  const btns = new Container(tmp, 'Button Bar');
  btns.fixedHeight = 50;

  const btnAdd = new Button(btns, 'Add');
  const lblAdd = new Label(btnAdd);
  lblAdd.text = '+1';

  btnAdd.onMouseClick = () => {
    lblCount.text = (parseInt(lblCount.text) + 1);
  }

  new Widget(btns, 'Spacer');

  const btnSub = new Button(btns, 'Sub');
  const lblSub = new Label(btnSub);
  lblSub.text = '-1';

  btnSub.onMouseClick = () => {
    lblCount.text = (parseInt(lblCount.text) - 1);
  }

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
    const btnFontA = makeLabelButton(row, '', font);
    btnFontA.onMouseClick = () => {
      lblA.font = Label.Fonts[font];
      lblB.font = Label.Fonts[font];
    }
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

menu.addChild(makeMenuButton('Panel', () => {
  display.removeChildren();

  const tmp = new Panel();

  display.addChild(makeCenter(tmp));
}));

menu.addChild(makeMenuButton('Modal Dialog', () => {
  display.removeChildren();

  const dialog = new ModalDialog(null, 'test');
  dialog.theme = Theme.Colors.Grey;
  const c = new Container();
  c.theme = Theme.Colors.Blue;
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
  const bl = new Label();
  bl.text = 'Close';
  b.addChild(bl);
  b.onMouseClick = () => {
    display.removeChild(dialog);
  }

  h.addChild(new Container());
  h.addChild(new Container());
  h.addChild(b);

  const tmp = new Button();
  tmp.fixedHeight = 50;
  const lbl = new Label();
  lbl.text = 'Open ModalDialog';
  tmp.addChild(lbl);
  tmp.onMouseClick = () => {
    display.addChild(dialog);
  }

  display.addChild(makeCenter(tmp));
}));

// Run the window's loop
while (!global.window.destroyed) {
  windowContext.clearRect(0, 0, width, height);

  root.draw(windowContext);
	const buffer = windowCanvas.toBuffer('raw');
	global.window.render(width, height, width * 4, 'bgra32', buffer);

	await setTimeout(10);
}