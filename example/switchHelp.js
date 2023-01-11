import {
  Container,
  Switch,
} from '../src/index.js';

export default () => {
  // Split the screen for a top tab bar
  const screen = new Container();
  screen.orientation = Container.Orientation.Horizontal;

  const spinnerA = new Switch();
  spinnerA.parent = screen;

  const spinnerB = new Switch();
  spinnerB.parent = screen;
  spinnerB.value = false;

  return screen;
};
