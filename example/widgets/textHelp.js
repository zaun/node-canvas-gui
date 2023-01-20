import {
  Colors,
  Container,
  Text,
} from '../../src/index.js';

export default () => {
  // Split the screen for a top tab bar
  const screen = new Container();
  screen.orientation = Container.Orientation.Vertical;

  const sectionA = new Text(null, 'TEXT A');
  sectionA.parent = screen;
  sectionA.baseFontColor = Colors.Black;
  sectionA.autoHeight = true;
  sectionA.text = `# Text
  
Use custom button styles for actions in forms, dialogs, and more with support for multiple sizes, states, and more.

## Examples`;

  const sectionB = new Text(null, 'TEXT B');
  sectionB.parent = screen;
  sectionB.baseFontColor = Colors.Black;
  sectionB.autoHeight = true;
  sectionB.text = `
## More Example
  `;

  return screen;
};
