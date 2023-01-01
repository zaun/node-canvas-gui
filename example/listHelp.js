import {
  Button,
  Container,
  Label,
  List,
} from '../src/index.js';

export default () => {
  // Split the screen for a top tab bar
  const screen = new Container();
  screen.orientation = Container.Orientation.Horizontal;

  const items = [
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

  const listA = new List(screen);
  listA.itemHeight = 30;
  listA.items = items;

  listA.itemCreate = (i) => {
    const l = new Label();
    l.text = i;
    l.fontSize = 20;
    return l;
  };

  const listB = new List(screen);
  listB.itemHeight = 38;
  listB.items = items;
  listB.cols = 3;
  listB.spacing = 10;

  listB.itemCreate = (i) => {
    const b = new Button();
    b.text = i;
    return b;
  };

  return screen;
};
