import ColorContrastChecker from 'color-contrast-checker';
import sbc from 'shade-blend-color';

const ccc = new ColorContrastChecker();
const pSBC = sbc.default;

export default class Colors {
  static White = '#ffffff';
  static Black = '#000000';
  static Transparent = '#00000000';

  static Blue = '#0d6efd';
  static Indigo = '#6610f2';
  static Purple = '#6f42c1';
  static Pink = '#d63384';
  static Red = '#dc3545';
  static Orange = '#fd7e14';
  static Yellow = '#ffc107';
  static Green = '#198754';
  static Teal = '#20c997';
  static Cyan = '#0dcaf0';
  static Gray = '#adb5bd';

  static darker(color, times = 1) {
    let per = -0.25 * times;
    if (per < -1) {
      per = -1;
    }
    return pSBC(Number(per), color);
  }

  static lighter(color, times = 1) {
    let per = 0.25 * times;
    if (per > 1) {
      per = 1;
    }
    return pSBC(Number(per), color);
  }

  static foregroundFor(color) {
    if (ccc.isLevelAA(color, this.White, 14)) {
      return this.White;
    }
    return this.Black;
  }

  static {
    Object.preventExtensions(this);
  }
}
