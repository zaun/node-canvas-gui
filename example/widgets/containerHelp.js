import {
  Colors,
  Container,
  Label,
  Panel,
} from '../../src/index.js';

export default () => {
  const createItem = (label) => {
    const p = new Panel();
    p.setColor(Colors.Yellow);
    const l = new Label(p);
    l.text = label;
    return p;
  };

  // Split the screen for a top tab bar
  const screen = new Container();
  screen.orientation = Container.Orientation.Horizontal;

  // Default example

  const basic = new Container(screen);
  basic.orientation = Container.Orientation.Vertical;
  const itemA = createItem('A');
  itemA.parent = basic;

  const itemB = createItem('B');
  itemB.parent = basic;

  const itemC = createItem('C');
  itemC.parent = basic;

  // Grow property example

  const grow = new Container(screen);
  grow.orientation = Container.Orientation.Vertical;
  const itemD = createItem('A');
  itemD.parent = grow;

  const itemE = createItem('B');
  itemE.parent = grow;
  itemE.grow = 2;

  const itemF = createItem('C');
  itemF.parent = grow;

  // Grow property example

  const sort = new Container(screen);
  sort.orientation = Container.Orientation.Vertical;
  const itemG = createItem('A');
  itemG.parent = sort;
  itemG.order = 3;

  const itemH = createItem('B');
  itemH.parent = sort;
  itemH.order = 2;

  const itemI = createItem('C');
  itemI.parent = sort;
  itemI.order = 1;

  return screen;
};
