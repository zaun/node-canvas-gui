import {
  Container,
  Spinner,
} from '../src/index.js';

export default () => {
  // Split the screen for a top tab bar
  const screen = new Container();
  screen.orientation = Container.Orientation.Horizontal;

  const spinner = new Spinner();
  spinner.parent = screen;

  return screen;
};
