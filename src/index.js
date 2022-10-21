import { registerFont } from 'canvas';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import Widget from './Widget.js';
import Container from './Container.js';
import ModalDialog from './ModalDialog.js';
import Theme from './Theme.js';
import Panel from './Panel.js';
import Label from './Label.js';
import Button from './Button.js';
import Image from './Image.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __fonts = `${__dirname}/../fonts`;

registerFont(`${__fonts}/Kenney Blocks.ttf`, { family: 'Kenney_Blocks' });
registerFont(`${__fonts}/Kenney Future Narrow.ttf`, { family: 'Kenney_Future_Narrow' });
registerFont(`${__fonts}/Kenney Future.ttf`, { family: 'Kenney_Future' });
registerFont(`${__fonts}/Kenney High Square.ttf`, { family: 'Kenney_High_Square' });
registerFont(`${__fonts}/Kenney High.ttf`, { family: 'Kenney_High' });
registerFont(`${__fonts}/Kenney Mini Square Mono.ttf`, { family: 'Kenney_Mini_Square_Mono' });
registerFont(`${__fonts}/Kenney Mini Square.ttf`, { family: 'Kenney_Mini_Square' });
registerFont(`${__fonts}/Kenney Mini.ttf`, { family: 'Kenney_Mini' });
registerFont(`${__fonts}/Kenney Pixel Square.ttf`, { family: 'Kenney_Pixel_Square' });
registerFont(`${__fonts}/Kenney Pixel.ttf`, { family: 'Kenney_Pixel' });
registerFont(`${__fonts}/Kenney Rocket Square.ttf`, { family: 'Kenney_Rocket_Square' });
registerFont(`${__fonts}/Kenney Rocket.ttf`, { family: 'Kenney_Rocket' });

const makeLabelButton = (parent = null, name = '', text = '') => {
  const button = new Button (parent, name);
  const label = new Label(button);
  label.text = text;

  return button;
};

export {
  Widget,
  Container,
  ModalDialog,
  Theme,
  Panel,
  Label,
  Button,
  Image,
  makeLabelButton,
};
