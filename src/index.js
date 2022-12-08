import { registerFont } from 'canvas';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import Widget from './Widget.js';
import Container from './Container.js';
import ModalDialog from './ModalDialog.js';
import Theme from './Theme.js';
import Panel from './Panel.js';
import Label from './Label.js';
import List from './List.js';
import Button from './Button.js';
import Image from './Image.js';
import Input from './Input.js';
import Text from './Text.js';

const filename = fileURLToPath(import.meta.url);
const importPath = dirname(filename);
const fontPath = `${importPath}/../fonts`;

registerFont(`${fontPath}/Kenney Blocks.ttf`, { family: 'Kenney_Blocks' });
registerFont(`${fontPath}/Kenney Future Narrow.ttf`, { family: 'Kenney_Future_Narrow' });
registerFont(`${fontPath}/Kenney Future.ttf`, { family: 'Kenney_Future' });
registerFont(`${fontPath}/Kenney High Square.ttf`, { family: 'Kenney_High_Square' });
registerFont(`${fontPath}/Kenney High.ttf`, { family: 'Kenney_High' });
registerFont(`${fontPath}/Kenney Mini Square Mono.ttf`, { family: 'Kenney_Mini_Square_Mono' });
registerFont(`${fontPath}/Kenney Mini Square.ttf`, { family: 'Kenney_Mini_Square' });
registerFont(`${fontPath}/Kenney Mini.ttf`, { family: 'Kenney_Mini' });
registerFont(`${fontPath}/Kenney Pixel Square.ttf`, { family: 'Kenney_Pixel_Square' });
registerFont(`${fontPath}/Kenney Pixel.ttf`, { family: 'Kenney_Pixel' });
registerFont(`${fontPath}/Kenney Rocket Square.ttf`, { family: 'Kenney_Rocket_Square' });
registerFont(`${fontPath}/Kenney Rocket.ttf`, { family: 'Kenney_Rocket' });

const makeLabelButton = (text = '', parent = null, name = '') => {
  const button = new Button(parent, name);
  const label = new Label(button);
  label.text = text;
  label.foreground = label.theme.colors.actionForeground;
  return button;
};

export {
  Widget,
  Container,
  ModalDialog,
  Theme,
  Panel,
  Label,
  List,
  Button,
  Image,
  Input,
  Text,
  makeLabelButton,
};
