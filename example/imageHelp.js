import {
  Colors,
  Container,
  Image,
  Spinner,
  Text,
} from '../src/index.js';

import util from './util.js';

export default () => {
  // Split the screen for a top tab bar
  const screen = new Container();
  screen.orientation = Container.Orientation.Vertical;

  const intro = new Text(null, 'TEXT');
  intro.parent = screen;
  intro.baseFontColor = Colors.Black;
  intro.autoHeight = true;
  intro.text = `
# Images
  
The Image widget displays an image.

## Examples`;

  const img = new Image();
  img.fixedHeight = 150;
  img.loadingWidget = new Spinner();
  img.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/SNice.svg/768px-SNice.svg.png';

  const exampleA = util.createExample(
    img,
    `
\`\`\`
const img = new Image();
img.fixedHeight = 150;
img.loadingWidget = new Spinner();
img.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/SNice.svg/768px-SNice.svg.png';
\`\`\`
    `,
  );
  exampleA.parent = screen;

  const sectionA = new Text(null, 'TEXT');
  sectionA.parent = screen;
  sectionA.baseFontColor = Colors.Black;
  sectionA.autoHeight = true;
  sectionA.text = `
## Supported Formats
`;
  return screen;
};
