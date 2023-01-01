import {
  Container,
  Spinner,
} from '../src/index.js';

export default () => {
  // Split the screen for a top tab bar
  const screen = new Container();
  screen.orientation = Container.Orientation.Horizontal;

  const spinnerA = new Spinner();
  spinnerA.parent = screen;

  const spinnerB = new Spinner();
  spinnerB.text = 'Custom\nText';
  spinnerB.parent = screen;

  const spinnerC = new Spinner();
  spinnerC.text = 'Larger Text';
  spinnerC.fontSize = 20;
  spinnerC.parent = screen;

  const spinnerD = new Spinner();
  spinnerD.text = '';
  spinnerD.parent = screen;

  return screen;
};
