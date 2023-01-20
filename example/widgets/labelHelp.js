import {
  Button,
  Colors,
  Container,
  Fonts,
  Label,
} from '../../src/index.js';

export default () => {
  // Split the screen for a top tab bar
  const screen = new Container();
  screen.orientation = Container.Orientation.Vertical;
  screen.justifyItems = Container.JustifyItems.Between;

  const lblA = new Label();
  const lblB = new Label();
  lblA.text = 'This is a label';
  lblB.text = 'This is a multi-line label\nthat has centered text.';
  screen.addChild(lblA);
  screen.addChild(lblB);

  const buttonBar = new Container(null, 'Button Bar');
  buttonBar.orientation = Container.Orientation.Vertical;
  buttonBar.autoHeight = true;

  let row = new Container(buttonBar, 'Font Justification Change Bar');
  row.fixedHeight = 40;

  // Font justification change buttons
  const justifyItems = Object.keys(Label.Justify);
  const justifyButtons = {};
  justifyItems.forEach((item) => {
    const btnJustify = new Button(row);
    btnJustify.setColor(Colors.Cyan);
    if (Label.Justify[item] === lblA.justify) {
      btnJustify.setColor(Colors.Green);
    }

    justifyButtons[item] = btnJustify;
    btnJustify.text = item;
    btnJustify.onMouseClick = () => {
      lblA.justify = Label.Justify[item];
      lblB.justify = Label.Justify[item];
      justifyItems.forEach((i) => {
        if (i === item) {
          justifyButtons[i].setColor(Colors.Green);
        } else {
          justifyButtons[i].setColor(Colors.Cyan);
        }
      });
    };
  });

  // Font size change buttons
  row = new Container(buttonBar, 'Font Size Change Buttons');
  row.fixedHeight = 40;

  const fontSizes = [16, 18, 20, 24, 30, 36, 42, 48, 60, 72, 84];
  const sizeButtons = {};
  fontSizes.forEach((size) => {
    const btnFontSize = new Button(row);
    btnFontSize.setColor(Colors.Cyan);
    if (size === lblA.fontSize) {
      btnFontSize.setColor(Colors.Green);
    }

    sizeButtons[size] = btnFontSize;
    btnFontSize.text = size;
    btnFontSize.onMouseClick = () => {
      lblA.fontSize = size;
      lblB.fontSize = size;
      fontSizes.forEach((s) => {
        if (s === size) {
          sizeButtons[s].setColor(Colors.Green);
        } else {
          sizeButtons[s].setColor(Colors.Cyan);
        }
      });
    };
  });

  // Font change buttons
  Object.keys(Fonts).forEach((font, idx) => {
    if (idx % 5 === 0) {
      row = new Container(buttonBar, `Font Button Bar ${idx / 5}`);
      row.fixedHeight = 40;
    }
    const btnFont = new Button(row);
    btnFont.text = font;
    btnFont.onMouseClick = () => {
      lblA.font = Fonts[font];
      lblB.font = Fonts[font];
    };
  });

  buttonBar.parent = screen;

  return screen;
};
