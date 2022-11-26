import { createCanvas, Image } from 'canvas';
import sp from 'synchronized-promise';

export default class Theme {
  static #Themes = {
    Inherit: 'Inherit',
    Eagle: 'GUI1',
    Round: 'GUI3',
  };

  static #Parts = {
    Panel: 'PANEL_A',
    Button: 'BUTTON_A',
    ButtonHover: 'BUTTON_A_HOVER',
    ButtonPressed: 'BUTTON_A_PRESSED',
    InputBackground: 'BUTTON_A',
    Test: 'TEST',
  };

  static #themeImages = {
    GUI1: 'data:@file/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAGgCAMAAABi2ZIKAAAAAXNSR0IArs4c6QAAAAlQTFRFAAAA////AAAAc8aDcQAAAAN0Uk5TAP//RFDWIQAAA4RJREFUeJztm4uyqzAIRbX//9F3rM1NgqR5EEg43cycsZW4l0LARz3H8d9ebzuE9kXFAHCeMwBFFSOADHFtvxYgQ9zyqwE3YtSCgiWAGyCzXNECEB0z5HMlGwANjTzJqY4+IC0QKYJqPCpQDZAWeXsqeSs0HHVA2urOs7W5UQvbs90IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwBUgOk6hxR21BAT5OGjMqIYNgHfNQtj8xJKnZ4almla/QnGHOC6fmj6ANosZSV77cy85rC4LiJUAiXxErAVI5CsqBgBpgCoqADQA/M+iv1DJ/rupxzMaN2DqSd8AEB0z5HMlvF/UAkgLRIqgGo8KVAP4v8uMjeIGtTY3avs9SuhF7Qa4vnsG9MvvBRiR3wswZgAAAAAAAAAAAAAAAAAAAADsALi29Qy45f0CgrxnQPzkE5Ci1gGi4xRa3FFLQJCPg8aMatgAeNcsBN4vagOUDnFcPjW8X9QPIIfVZQGB94tkAIl8RcUAIA1QRQWABoD/WfQXKtl/N/V4RuMGTD3pGwCiY4Z8roT3i1oAaYFIEVTjUYFqAP93mbFR3KDW5kbN66ME/09bru18A/w/dYwIz4CAAQAAAAAAAAAAAAAAAAAAAGA+4PrsG+D/P4nGELsB0kdNXgG9thIQHafQ4o5aAoJ8HDRmVMMGwLtmIfB+URugdIjj8qnh/aJ+ADmsLgsIvF8kA0jkKyoGAGmAKiqagNoqqf94nc8B6Sqp//pGRryogMh/PDL/ngvz/NcA0uNOKjDsz9pgua0P+4+7O7EnjnuY0H8EOtvZ8yb/3OMG/ych3DQLieMUwpoW/zPldGK8/UwAWv23GAfIYPkevnr8rYDUyQGKfgAAAGAjwHCr0G52yu1a/YRjccqMxMzP7NGAPw042WDSZQudMuzEkvotLh21L34VL9/vjITMPJfSPxuAzL4j9AHfwlPfvCFE6gD1EJkAUAeog1/PQRhSWqIOUAe/kIMwpLREHaAOfiEHYUhpyd2g5jeT6wG1NItDpAyoT1NhiNQBNfkJOTAAoA5QB6gD1MFqAOpgDwDqAHWgWQcTQrQcUAtRzfQB9STX/2jAUtMH1AqtHoT1AFl49gCMN4qGaaoOkE7TYmw+a/QB0mm6A2BSm1gKQB18axf6gBnTdDVAPk3XA1AHbGw+K/QBM6bpaoB8mi4F/AMOgIWBxIL7qQAAAABJRU5ErkJggg==',
    GUI3: 'data:@file/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAGgCAMAAABi2ZIKAAAAAXNSR0IArs4c6QAAAAlQTFRFAAAA////AAAAc8aDcQAAAAN0Uk5TAP//RFDWIQAAA0lJREFUeJztmouygjAMRMX//+g7yptLmmiyIng64zBjYY9NG+xjbze73MOlIdIS78LlVchL4gtIWH54JP6LJkZcPi6+gviId+VnRFv+/rb6xGg1Iq3vEPLyI0KpbxOq9C1Cnf4+oVJ/j/AYP3X6D8JmLBXrPwlS/Q2htgNGwIIgaMCqCRL9JUENUPRADxgIogbMTVADZPojAYAHEOr3BAAAAAAAAAAAAAAAAAAAAADABwHn36u4AOD8e3b6bc3z7/zqN8f12/vyAwr9EYv+kEh+zKU/qNMfNeoPS/XHvfoDa/2R+01uGrjpbQ8zQmXc6BFS68nIEJpnFhCZ/UcOwF/kysfFVxD8RUnClfxF+Y7w9HNN2SNU6jv+oqKeNv1FZT1tTK6L9E1/UZm+4S+q0zeWaKWLhJ1VZvkiZNLvBPr//UWVHTAIbgG1+viLvgZw/n1TAAAAAAAAAAAAAAAAAAAAAMAMOP9exQUA+Isa+viLwvr4iwL6+IsC+viLIvr4i/AXeQV/Ef6ilfzwSPwXTYy4fFx8BcFflCRcyV/0nm6bkP79XZtQEJ8moWbqOCMa/qI6gkDfJBTOSyelbrPCKdJfEURLtJ0glS8+NoDyJeBsJxJtJXQTQbVXsQacf7/o9IDz75sCAAAAAAAAAAAAAAAAAAAAAGbA+fcqLgDAX9TQx18U1sdfFNDHXxTQx18U0cdfhL/IK1f2F3lP5utbTdfW98HN1T8zy2rgsypZ/wBYnXS/9wJ2iAP1T4DZ/ZOAEZ5AfQxgBThQHwYY8Xfro4B/k4T7GmDWhwFNeKMeAAAAAACsRDZVW0D2dS3/wxH/Ze4qvPCnr562mHd0RnxfqddPHeWTX/n0vW/kGLP/1+znM4BcaSP0gFZ4/McDIZID5CH6CIA8IA9+vQ/GW6wreUAe/EIfjLdYV/KAPPiFPhhvsa6tBVK/iDke4HVzOkRigD9MkyGSAzz5gj74AIA8IA/IA/LgaAB58B0A8oA8UOZBQYgOB3gh8ooe4Hey/9kGbFn0AC/R/CAcD8iF5zsA778oAsNUDsgOUzM2wzd6QHaYfgOg6DVxKIA8aL0u9ICKYXo0ID9MjweQB7uxGb7QAyqG6dGA/DA9FPAHZp9UlXzuZFcAAAAASUVORK5CYII=',
  };

  static #themeColors = {
    GUI1: {
      foreground: '#CCCCCC',
      background: '#444444',
      action: '#CCCCCC',
      actionForeground: '#212112',
      actionLightForeground: '#515151',
      actionHighlight: '#BBBBBB',
      actionPressed: '#999999',
    },
    GUI3: {
      foreground: '#CCCCCC',
      background: '#444444',
      action: '#CCCCCC',
      actionForeground: '#444444',
      actionHighlight: '#BBBBBB',
      actionPressed: '#999999',
    },
  };

  static #themeParts = {
    GUI1: {
      PANEL_A: {
        x: 0,
        y: 0,
        width: 96,
        height: 96,
        vertCutA: 32,
        vertCutB: 64,
        horizCutA: 32,
        horizCutB: 64,
        backgroundIndent: 21,
      },
      PANEL_B: {
        x: 96,
        y: 0,
        width: 96,
        height: 96,
        vertCutA: 32,
        vertCutB: 64,
        horizCutA: 32,
        horizCutB: 64,
        backgroundIndent: 21,
      },
      PANEL_C: {
        x: 192,
        y: 0,
        width: 96,
        height: 96,
        vertCutA: 32,
        vertCutB: 64,
        horizCutA: 32,
        horizCutB: 64,
        backgroundIndent: 21,
      },
      BACKGROUND_A: {
        x: 416,
        y: 0,
        width: 32,
        height: 32,
      },
      BACKGROUND_B: {
        x: 448,
        y: 0,
        width: 32,
        height: 32,
      },
      BACKGROUND_C: {
        x: 480,
        y: 0,
        width: 32,
        height: 32,
      },
      BUTTON_A: {
        x: 0,
        y: 288,
        width: 32,
        height: 32,
        vertCutA: 12,
        vertCutB: 20,
        horizCutA: 12,
        horizCutB: 20,
        backgroundIndent: 5,
      },
      BUTTON_A_HOVER: {
        x: 32,
        y: 288,
        width: 32,
        height: 32,
        vertCutA: 12,
        vertCutB: 20,
        horizCutA: 12,
        horizCutB: 20,
        backgroundIndent: 5,
      },
      BUTTON_A_PRESSED: {
        x: 64,
        y: 288,
        width: 32,
        height: 32,
        vertCutA: 12,
        vertCutB: 20,
        horizCutA: 12,
        horizCutB: 20,
        backgroundIndent: 5,
      },
    },
    GUI3: {
      PANEL_A: {
        x: 0,
        y: 0,
        width: 96,
        height: 96,
        vertCutA: 32,
        vertCutB: 64,
        horizCutA: 32,
        horizCutB: 64,
        backgroundIndent: 21,
      },
      PANEL_B: {
        x: 96,
        y: 0,
        width: 96,
        height: 96,
        vertCutA: 32,
        vertCutB: 64,
        horizCutA: 32,
        horizCutB: 64,
        backgroundIndent: 21,
      },
      PANEL_C: {
        x: 192,
        y: 0,
        width: 96,
        height: 96,
        vertCutA: 32,
        vertCutB: 64,
        horizCutA: 32,
        horizCutB: 64,
        backgroundIndent: 21,
      },
      BACKGROUND_A: {
        x: 416,
        y: 0,
        width: 32,
        height: 32,
      },
      BACKGROUND_B: {
        x: 448,
        y: 0,
        width: 32,
        height: 32,
      },
      BACKGROUND_C: {
        x: 480,
        y: 0,
        width: 32,
        height: 32,
      },
      BUTTON_A: {
        x: 0,
        y: 288,
        width: 32,
        height: 32,
        vertCutA: 12,
        vertCutB: 20,
        horizCutA: 12,
        horizCutB: 20,
        backgroundIndent: 5,
      },
      BUTTON_A_HOVER: {
        x: 32,
        y: 288,
        width: 32,
        height: 32,
        vertCutA: 12,
        vertCutB: 20,
        horizCutA: 12,
        horizCutB: 20,
        backgroundIndent: 5,
      },
      BUTTON_A_PRESSED: {
        x: 64,
        y: 288,
        width: 32,
        height: 32,
        vertCutA: 12,
        vertCutB: 20,
        horizCutA: 12,
        horizCutB: 20,
        backgroundIndent: 5,
      },
    },
  };

  static #default = null;

  static get Themes() {
    return this.#Themes;
  }

  static get Parts() {
    return this.#Parts;
  }

  static get default() {
    if (this.#default === null) {
      this.#default = new Theme(Theme.Themes.Eagle);
    }
    return this.#default;
  }

  #theme = null;
  #assets = {};

  constructor(theme = Theme.Themes.Inherit) {
    this.theme = theme;
    this.#assets.EMPTY = createCanvas(1, 1);
  }

  get theme() {
    return this.#theme;
  }

  set theme(val) {
    this.#theme = val;
    this.#preload();
  }

  get colors() {
    return Theme.#themeColors[this.#theme];
  }

  #createImage() {
    return new Promise((resolve, reject) => {
      this.#assets.image = new Image();
      this.#assets.image.onload = () => {
        resolve();
      };
      this.#assets.image.onerror = (err) => {
        delete this.#assets.image;
        reject(err);
      };
      this.#assets.image.src = Theme.#themeImages[this.#theme];
    });
  }

  #preload() {
    // Force this to be sync
    // The image is a data URI so it will be fast
    sp(this.#createImage());

    if (this.#theme === Theme.Themes.Inherit) {
      return;
    }

    Object.keys(Theme.#themeParts[this.#theme]).forEach((key) => {
      const entry = Theme.#themeParts[this.#theme][key];
      this.#assets[key] = createCanvas(entry.width, entry.height);
      const ctx = this.#assets[key].getContext('2d');
      ctx.drawImage(
        this.#assets.image,
        entry.x,
        entry.y,
        entry.width,
        entry.height,
        0,
        0,
        entry.width,
        entry.height,
      );
    });
  }

  getPartInfo = (partName = Theme.Parts.EMPTY) => {
    const ret = {
      bgIndent: 0,
      bgColor: '#000000',
      fgColor: '#FFFFFF',
    };

    if (Theme.#themeParts[this.#theme]) {
      const info = Theme.#themeParts[this.#theme][partName];
      ret.bgIndent = info ? info.backgroundIndent || 0 : 0;
      ret.bgColor = info ? info.background || 0 : 0;
    }
    return ret;
  };

  tint = (partName = Theme.Parts.EMPTY, color = '#000000', opacity = 1) => {
    let image = this.#assets.EMPTY;
    if (this.#assets.image && this.#assets[partName]) {
      image = this.#assets[partName];
    }

    const ret = createCanvas(image.width, image.height);
    const context = ret.getContext('2d');

    context.save();
    context.fillStyle = color;
    context.globalAlpha = opacity;
    context.fillRect(0, 0, ret.width, ret.height);
    context.globalCompositeOperation = 'destination-atop';
    context.globalAlpha = 1;
    context.drawImage(image, 0, 0);
    context.restore();

    return ret;
  };

  drawFillRectTiled = (canvasCtx, background, x, y, width, height) => {
    let image = this.#assets.EMPTY;
    if (this.#assets.image && this.#assets[background]) {
      image = this.#assets[background];
    }

    const pat = canvasCtx.createPattern(image, 'repeat');
    canvasCtx.fillStyle = pat;
    canvasCtx.fillRect(x, y, width, height);
  };

  draw9slice = (canvasCtx, partName, x, y, width, height, background) => {
    let image = this.#assets.EMPTY;
    if (this.#assets.image && this.#assets[partName]) {
      image = this.#assets[partName];
    }

    const partInfo = Theme.#themeParts[this.#theme][partName];

    if (background && background.startsWith('#')) {
      const indent = partInfo.backgroundIndent || 0;
      canvasCtx.fillStyle = background;
      canvasCtx.fillRect(
        x + indent,
        y + indent,
        width - (indent * 2),
        height - (indent * 2),
      );
    }

    const leftWidth = partInfo.vertCutA;
    const centerWidth = partInfo.vertCutB - partInfo.vertCutA;
    const rightWidth = image.width - partInfo.vertCutB;

    const topHeight = partInfo.horizCutA;
    const centerHeight = partInfo.horizCutB - partInfo.horizCutA;
    const bottomHeight = image.height - partInfo.horizCutB;

    const part1 = [0, 0, leftWidth, topHeight];
    const part2 = [partInfo.vertCutA, 0, centerWidth, topHeight];
    const part3 = [partInfo.vertCutB, 0, rightWidth, topHeight];
    const part4 = [0, partInfo.horizCutA, leftWidth, centerHeight];
    const part5 = [partInfo.vertCutA, partInfo.horizCutA, centerWidth, centerHeight];
    const part6 = [partInfo.vertCutB, partInfo.horizCutA, rightWidth, centerHeight];
    const part7 = [0, partInfo.horizCutB, leftWidth, bottomHeight];
    const part8 = [partInfo.vertCutA, partInfo.horizCutB, centerWidth, bottomHeight];
    const part9 = [partInfo.vertCutB, partInfo.horizCutB, rightWidth, bottomHeight];

    // top left
    canvasCtx.drawImage(
      image,
      ...part1,
      x + 0,
      y + 0,
      leftWidth,
      topHeight,
    );
    // top center
    canvasCtx.drawImage(
      image,
      ...part2,
      x + leftWidth,
      y + 0,
      width - leftWidth - rightWidth,
      topHeight,
    );
    // top right
    canvasCtx.drawImage(
      image,
      ...part3,
      x + width - rightWidth,
      y + 0,
      rightWidth,
      topHeight,
    );
    // bottom left
    canvasCtx.drawImage(
      image,
      ...part7,
      x + 0,
      y + height - bottomHeight,
      leftWidth,
      bottomHeight,
    );
    // bottom center
    canvasCtx.drawImage(
      image,
      ...part8,
      x + leftWidth,
      y + height - bottomHeight,
      width - leftWidth - rightWidth,
      bottomHeight,
    );
    // bottom right
    canvasCtx.drawImage(
      image,
      ...part9,
      x + width - rightWidth,
      y + height - bottomHeight,
      rightWidth,
      bottomHeight,
    );
    // left
    canvasCtx.drawImage(
      image,
      ...part4,
      x + 0,
      y + topHeight,
      leftWidth,
      height - topHeight - bottomHeight,
    );
    // center
    canvasCtx.drawImage(
      image,
      ...part5,
      x + partInfo.vertCutA,
      y + topHeight,
      centerWidth,
      height - topHeight - bottomHeight,
    );
    // right
    canvasCtx.drawImage(
      image,
      ...part6,
      x + width - rightWidth,
      y + topHeight,
      rightWidth,
      height - topHeight - bottomHeight,
    );
  };
}
