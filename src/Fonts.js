import { registerFont } from 'canvas';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const filename = fileURLToPath(import.meta.url);
const importPath = dirname(filename);
const fontPath = `${importPath}/../fonts`;

const fonts = {
  Sans: 'sans',
  Serif: 'serif',
  addFont(name, fontFileName) {
    fonts[name.replace(/ /g, '')] = name.replace(/ /g, '_');
    registerFont(`${fontPath}/${fontFileName}`, { family: name.replace(/ /g, '_') });
  },
};

const proxy = new Proxy(fonts, {
  // Don't allow people to set properties directly
  set(target, prop) {
    if (fonts[prop]) {
      throw Error('Can not change existing fonts.');
    }
    throw Error('Please use Fonts.addFont method to add new fonts.');
  },

  // Return the font family name
  get(target, prop) {
    return fonts[prop];
  },

  // Remove 'addFont' from list of Keys
  ownKeys(target) {
    const keys = Reflect.ownKeys(target);
    const index = keys.indexOf('addFont');
    if (index > -1) {
      keys.splice(index, 1);
    }
    keys.sort();
    return keys;
  },
});

export default proxy;
