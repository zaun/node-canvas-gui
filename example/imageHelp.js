import {
  Colors,
  Container,
  Image,
  Label,
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

  const exampleBBar = new Container();
  exampleBBar.orientation = Container.Orientation.Horizontal;
  exampleBBar.autoHeight = true;

  const dataUriContainer = new Container(exampleBBar);
  dataUriContainer.orientation = Container.Orientation.Vertical;
  dataUriContainer.autoHeight = true;

  const dataUri = new Image(dataUriContainer);
  dataUri.src = 'data:image/png;base64,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';
  dataUri.loadingWidget = new Spinner();
  dataUri.fixedHeight = 100;
  dataUri.mode = Image.Mode.ScaleToFill;

  const dataUriLabel = new Label(dataUriContainer);
  dataUriLabel.text = 'Data URI';
  dataUriLabel.fixedHeight = 30;

  const dataJpgContainer = new Container(exampleBBar);
  dataJpgContainer.orientation = Container.Orientation.Vertical;
  dataJpgContainer.autoHeight = true;

  const jpg = new Image(dataJpgContainer);
  jpg.src = 'https://download.samplelib.com/jpeg/sample-clouds-400x300.jpg';
  jpg.loadingWidget = new Spinner();
  jpg.fixedHeight = 100;
  jpg.mode = Image.Mode.ScaleToFill;

  const jpgLabel = new Label(dataJpgContainer);
  jpgLabel.text = 'JPG';
  jpgLabel.fixedHeight = 30;

  const pngContainer = new Container(exampleBBar);
  pngContainer.orientation = Container.Orientation.Vertical;
  pngContainer.autoHeight = true;

  const png = new Image(pngContainer);
  png.src = 'https://download.samplelib.com/png/sample-boat-400x300.png';
  png.loadingWidget = new Spinner();
  png.fixedHeight = 100;
  png.mode = Image.Mode.ScaleToFill;

  const pngLabel = new Label(pngContainer);
  pngLabel.text = 'PNG';
  pngLabel.fixedHeight = 30;

  const gifContainer = new Container(exampleBBar);
  gifContainer.orientation = Container.Orientation.Vertical;
  gifContainer.autoHeight = true;

  const gif = new Image(gifContainer);
  gif.src = 'https://download.samplelib.com/gif/sample-red-400x300.gif';
  gif.loadingWidget = new Spinner();
  gif.fixedHeight = 100;
  gif.mode = Image.Mode.ScaleToFill;

  const gifLabel = new Label(gifContainer);
  gifLabel.text = 'GIF';
  gifLabel.fixedHeight = 30;

  const exampleB = util.createExample(
    exampleBBar,
    `
\`\`\`
const img = new Image();
img.fixedHeight = 150;
img.loadingWidget = new Spinner();
img.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/SNice.svg/768px-SNice.svg.png';
\`\`\`
    `,
  );
  exampleB.parent = screen;

  return screen;
};
