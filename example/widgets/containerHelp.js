import {
  Button,
  Colors,
  Container,
  Label,
  Panel,
} from '../../src/index.js';

export default () => {
  const createItem = (label, color) => {
    const p = new Panel();
    p.setColor(color);
    const l = new Label(p);
    l.text = label;
    return p;
  };

  // Split the screen for a top tab bar
  const screen = new Container();
  screen.orientation = Container.Orientation.Vertical;

  const display = new Container(screen);
  display.orientation = Container.Orientation.Vertical;

  // Default example

  const basic = new Container(display);
  basic.orientation = Container.Orientation.Horizontal;

  // const basicLabel = new Label(basic);
  // basicLabel.text = 'Basic Example';
  // basicLabel.fixedHeight = 30;

  const itemA = createItem('A', Colors.Yellow);
  itemA.parent = basic;

  const itemB = createItem('B', Colors.Yellow);
  itemB.parent = basic;

  const itemC = createItem('C', Colors.Yellow);
  itemC.parent = basic;

  // Grow property example

  const grow = new Container(display);
  grow.orientation = Container.Orientation.Horizontal;
  const itemD = createItem('A\nGrow = 1', Colors.Blue);
  itemD.parent = grow;
  itemD.grow = 1;

  const itemE = createItem('B\nGrow = 2', Colors.Blue);
  itemE.parent = grow;
  itemE.grow = 2;

  const itemF = createItem('C\nGrow = 3', Colors.Blue);
  itemF.parent = grow;
  itemF.grow = 3;

  // Sort property example

  const sort = new Container(display);
  sort.orientation = Container.Orientation.Horizontal;
  const itemG = createItem('A\nSort = 3', Colors.Teal);
  itemG.parent = sort;
  itemG.order = 3;

  const itemH = createItem('B\nSort = 2', Colors.Teal);
  itemH.parent = sort;
  itemH.order = 2;

  const itemI = createItem('C\nSort = 1', Colors.Teal);
  itemI.parent = sort;
  itemI.order = 1;

  // Fixed example

  const fixed = new Container(display);
  fixed.orientation = Container.Orientation.Horizontal;
  const itemJ = createItem('A', Colors.Orange);
  itemJ.parent = fixed;
  itemJ.fixedHeight = 50;
  itemJ.fixedWidth = 50;

  const itemK = createItem('B', Colors.Orange);
  itemK.parent = fixed;
  itemK.fixedHeight = 75;
  itemK.fixedWidth = 75;

  const itemL = createItem('C', Colors.Orange);
  itemL.parent = fixed;
  itemL.fixedHeight = 50;
  itemL.fixedWidth = 50;

  // Auto size example

  const auto = new Container(display);
  auto.orientation = Container.Orientation.Horizontal;
  auto.autoSize = true;
  const itemM = createItem('A', Colors.Orange);
  itemM.parent = auto;
  itemM.fixedHeight = 50;
  itemM.fixedWidth = 50;

  const itemN = createItem('B', Colors.Orange);
  itemN.parent = auto;
  itemN.fixedHeight = 75;
  itemN.fixedWidth = 75;

  const itemO = createItem('C', Colors.Orange);
  itemO.parent = auto;

  const buttonBar = new Container(screen);
  buttonBar.orientation = Container.Orientation.Vertical;
  buttonBar.autoSize = true;

  // Add orientation options
  const orientationContainer = new Container(buttonBar);
  orientationContainer.orientation = Container.Orientation.Horizontal;
  orientationContainer.autoSize = true;

  const orientationItems = Object.keys(Container.Orientation);
  const orientationButtons = {};
  orientationItems.forEach((item) => {
    const btn = new Button(orientationContainer);
    btn.setColor(Colors.Cyan);
    if (Container.Orientation[item] === basic.orientation) {
      btn.setColor(Colors.Green);
    }

    orientationButtons[item] = btn;
    btn.text = item;
    btn.onMouseClick = () => {
      if (item === 'Horizontal') {
        display.orientation = Container.Orientation.Vertical;
        basic.orientation = Container.Orientation.Horizontal;
        grow.orientation = Container.Orientation.Horizontal;
        sort.orientation = Container.Orientation.Horizontal;
        fixed.orientation = Container.Orientation.Horizontal;
        auto.orientation = Container.Orientation.Horizontal;
      } else if (item === 'Vertical') {
        display.orientation = Container.Orientation.Horizontal;
        basic.orientation = Container.Orientation.Vertical;
        grow.orientation = Container.Orientation.Vertical;
        sort.orientation = Container.Orientation.Vertical;
        fixed.orientation = Container.Orientation.Vertical;
        auto.orientation = Container.Orientation.Vertical;
      } else if (item === 'Stack') {
        display.orientation = Container.Orientation.Stack;
        basic.orientation = Container.Orientation.Vertical;
        grow.orientation = Container.Orientation.Horizontal;
        sort.orientation = Container.Orientation.Vertical;
        fixed.orientation = Container.Orientation.Horizontal;
        auto.orientation = Container.Orientation.Vertical;
      }

      orientationItems.forEach((i) => {
        if (i === item) {
          orientationButtons[i].setColor(Colors.Green);
        } else {
          orientationButtons[i].setColor(Colors.Cyan);
        }
      });
    };
  });

  // Add justify options
  const justifyContainer = new Container(buttonBar);
  justifyContainer.orientation = Container.Orientation.Horizontal;
  justifyContainer.autoSize = true;
  const justifyItems = Object.keys(Container.JustifyItems);
  const justifyButtons = {};
  justifyItems.forEach((item) => {
    const btn = new Button(justifyContainer);
    btn.setColor(Colors.Cyan);
    if (Container.JustifyItems[item] === basic.justifyItems) {
      btn.setColor(Colors.Green);
    }

    justifyButtons[item] = btn;
    btn.text = item;
    btn.onMouseClick = () => {
      basic.justifyItems = Container.JustifyItems[item];
      grow.justifyItems = Container.JustifyItems[item];
      sort.justifyItems = Container.JustifyItems[item];
      fixed.justifyItems = Container.JustifyItems[item];
      auto.justifyItems = Container.JustifyItems[item];

      justifyItems.forEach((i) => {
        if (i === item) {
          justifyButtons[i].setColor(Colors.Green);
        } else {
          justifyButtons[i].setColor(Colors.Cyan);
        }
      });
    };
  });

  // Add align options
  const alignContainer = new Container(buttonBar);
  alignContainer.orientation = Container.Orientation.Horizontal;
  alignContainer.autoSize = true;
  const alignItems = Object.keys(Container.AlignItems);
  const alignButtons = {};
  alignItems.forEach((item) => {
    const btn = new Button(alignContainer);
    btn.setColor(Colors.Cyan);
    if (Container.AlignItems[item] === basic.alignItems) {
      btn.setColor(Colors.Green);
    }

    alignButtons[item] = btn;
    btn.text = item;
    btn.onMouseClick = () => {
      basic.alignItems = Container.AlignItems[item];
      grow.alignItems = Container.AlignItems[item];
      sort.alignItems = Container.AlignItems[item];
      fixed.alignItems = Container.AlignItems[item];
      auto.alignItems = Container.AlignItems[item];

      alignItems.forEach((i) => {
        if (i === item) {
          alignButtons[i].setColor(Colors.Green);
        } else {
          alignButtons[i].setColor(Colors.Cyan);
        }
      });
    };
  });

  return screen;
};
