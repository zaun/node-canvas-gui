import Canvas from 'canvas';
import crypto from 'crypto';
import SimpleMarkdown from '@khanacademy/simple-markdown';
import Container from './Container.js';

export default class Text extends Container {
  #text = '';
  #tokens = [];
  #md = null;

  #currentHeight = 0;
  #currentWidth = 0;
  #currentLineMaxHeight = 0;

  #firstText = true;

  #paraPadding = 5;
  #blockQuoteIndent = 20;
  #blockQuotePadding = 15;
  #blockQuoteBarWidth = 12;
  #blockQuoteForeground = '#444444';
  #blockQuoteBackground = '#222222';
  #blockQuoteInfoForeground = '#0dcaf0';
  #blockQuoteInfoBackground = '#055060';
  #blockQuoteWarnForeground = '#ffc107';
  #blockQuoteWarnBackground = '#664d02';
  #listPadding = 10;
  #codeBlockPadding = 15;

  #baseFont = 'sans';
  #baseFontSize = 15;
  #baseFontStyle = '';
  #baseFontColor = '#BBBBBB';
  #baseFontUnderline = '#BBBBBB';

  #blockQuote = false;
  #blockQuoteStartHeight = 0;

  #list = false;
  #listCount = 0;

  #heading = false;
  #headingLevel = 0;
  #headingPre = '';
  #headingPost = '';

  #codeBlock = false;
  #inlineCode = false;

  #view;
  #scroll = 0;

  constructor(parent = null, name = crypto.randomUUID()) {
    super(parent, name);

    const rules = { ...SimpleMarkdown.defaultRules };
    rules.blockQuote = {
      order: SimpleMarkdown.defaultRules.blockQuote.order - 0.5,
      // match: (source) => /^( *>[^\n]+(\n[^\n]+)*\n*)+\n{2,}/.exec(source),
      match: (source) => /^( *>[^\n]+(\n[^\n]+)*)+\n{2,}/.exec(source),
      parse: (capture, parse, state) => {
        let content = capture[0];
        let mode = 'default';
        if (content.startsWith('> info <\n')) {
          content = content.slice(9);
          mode = 'info';
        } else if (content.startsWith('> warn <\n')) {
          content = content.slice(9);
          mode = 'warn';
        } else if (content.startsWith('> err <\n')) {
          content = content.slice(8);
          mode = 'error';
        } else if (content.startsWith('> error <\n')) {
          content = content.slice(10);
          mode = 'error';
        }
        content = content.replace(/^ *> ?/gm, '').trim();
        return {
          mode,
          content: parse(content, state),
        };
      },
      react: () => {},
    };

    this.#md = SimpleMarkdown.parserFor(rules);
    this.#view = Canvas.createCanvas(this.body.w, this.body.h);

    if (new.target === Text) {
      Object.preventExtensions(this);
    }
  }

  get text() {
    return this.#text;
  }

  set text(val) {
    this.#text = val.toString();
    this.#tokens = this.#md(`\n\n${this.#text}\n\n`);
    this.#updateView();
    // console.log(JSON.stringify(this.#tokens, null, 2));
  }

  get #maxScroll() {
    const viewHeight = this.#view.height;
    if (viewHeight > this.body.h) {
      return viewHeight - this.body.h;
    }
    return 0;
  }

  _eventMouseWheel({ x, y, dy }) {
    if (
      x >= this.body.x && x <= this.body.x + this.body.w
      && y >= this.body.y && y <= this.body.y + this.body.h
    ) {
      if (this.#maxScroll === 0) {
        this.#scroll = 0;
        return;
      }

      this.#scroll += dy * 10;
      if (this.#scroll < 0) {
        this.#scroll = 0;
      }

      if (this.#scroll > this.#maxScroll && this.#maxScroll > 0) {
        this.#scroll = this.#maxScroll;
      }
    }
  }

  #updateView() {
    this.#currentWidth = 0;
    this.#currentHeight = 0;
    this.#currentLineMaxHeight = 0;
    this.#firstText = true;

    this.#view = Canvas.createCanvas(this.body.w, this.body.h);
    let viewCtx = this.#view.getContext('2d');
    this.#processTokens(viewCtx, this.#tokens, true);

    this.#view = Canvas.createCanvas(this.body.w, this.#currentHeight);

    this.#currentWidth = 0;
    this.#currentHeight = 0;
    this.#currentLineMaxHeight = 0;
    this.#firstText = true;

    viewCtx = this.#view.getContext('2d');
    this.#processTokens(viewCtx, this.#tokens, false);
  }

  #setFont(canvasCtx) {
    let font = this.#baseFont;
    let size = this.#baseFontSize;
    let style = this.#baseFontStyle;
    if (this.#heading) {
      size = (10 - this.#headingLevel) * 0.25 * this.#baseFontSize;
      style = 'bold';

      if (size < this.#baseFontSize) {
        size = this.#baseFontSize;
        style += ' oblique';
      }
    } else if (this.#codeBlock || this.#inlineCode) {
      font = 'monospace';
    }
    canvasCtx.font = `${style} ${size}px ${font}`.trim();
  }

  // eslint-disable-next-line class-methods-use-this
  #drawText(canvasCtx, text, x, y, w, ha, hd) {
    this.#setFont(canvasCtx);
    if (this.#inlineCode) {
      canvasCtx.beginPath();
      canvasCtx.fillStyle = '#222222';
      canvasCtx.fillRect(
        x,
        y - ha,
        w,
        ha + hd,
      );
    }

    canvasCtx.fillStyle = this.#baseFontColor;
    canvasCtx.fillText(text, x, y);

    if (this.#baseFontUnderline === true) {
      canvasCtx.strokeStyle = this.#baseFontColor;
      canvasCtx.lineWidth = 1;
      canvasCtx.beginPath();
      canvasCtx.moveTo(x, y + 2);
      canvasCtx.lineTo(x + w, y + 2);
      canvasCtx.stroke();
    }
  }

  #processTokens(canvasCtx, tokens, doNotDraw = false) {
    tokens.forEach((token) => {
      // Pre token processing
      switch (token.type) {
        case 'paragraph':
          this.#currentWidth = this.#blockQuote ? this.#blockQuoteIndent : 0;
          this.#currentHeight += this.#blockQuote ? 0 : this.#paraPadding;
          break;
        case 'em':
          this.#baseFontStyle += ' oblique';
          this.#baseFontStyle = this.#baseFontStyle.trim();
          break;
        case 'strong':
          this.#baseFontStyle += ' bold';
          this.#baseFontStyle = this.#baseFontStyle.trim();
          break;
        case 'u':
          this.#baseFontUnderline = true;
          break;
        case 'heading':
          this.#heading = true;
          this.#headingLevel = token.level;
          this.#currentWidth = 0;
          break;
        case 'blockQuote':
          this.#blockQuote = true;
          this.#blockQuoteStartHeight = this.#currentHeight;
          this.#currentHeight += this.#blockQuotePadding;
          this.#currentWidth = this.#blockQuoteIndent;

          if (token.bgSize && !doNotDraw) {
            canvasCtx.beginPath();
            canvasCtx.fillStyle = this.#blockQuoteBackground;
            if (token.mode === 'info') {
              canvasCtx.fillStyle = this.#blockQuoteInfoBackground;
            }
            if (token.mode === 'warn') {
              canvasCtx.fillStyle = this.#blockQuoteWarnBackground;
            }
            canvasCtx.fillRect(
              this.body.x + this.#blockQuoteBarWidth,
              this.#blockQuoteStartHeight,
              this.body.w - this.#blockQuoteBarWidth,
              token.bgSize,
            );
          }
          break;
        case 'list':
          this.#list = true;
          this.#listCount = -1;
          if (token.ordered === true) {
            this.#listCount = token.start;
          }
          this.#currentHeight += this.#listPadding;
          break;
        case 'codeBlock':
          this.#codeBlock = true;
          if (!this.#firstText) {
            this.#currentHeight += this.#codeBlockPadding;
          }
          break;
        case 'inlineCode':
          this.#inlineCode = true;
          break;
        case 'hr':
          this.#currentHeight += this.#paraPadding;
          this.#currentWidth = 0;
          canvasCtx.strokeStyle = this.#baseFontColor;
          canvasCtx.lineWidth = 2;

          if (!doNotDraw) {
            canvasCtx.beginPath();
            canvasCtx.moveTo(this.body.x, this.#currentHeight);
            canvasCtx.lineTo(this.body.x + this.body.w, this.#currentHeight);
            canvasCtx.stroke();
          }
          break;
        case 'newline':
        case 'text':
          break;
        default:
          // console.log(`Unknown MD token ${token.type}`);
          break;
      }

      // Process token content
      if (token.content) {
        if (Array.isArray(token.content)) {
          this.#processTokens(canvasCtx, token.content, doNotDraw);
        } else {
          this.#setFont(canvasCtx);
          const spaceInfo = canvasCtx.measureText(' ');
          const spWidth = spaceInfo.width;

          if (this.#firstText) {
            const cInfo = canvasCtx.measureText('W');
            this.#currentHeight = cInfo.emHeightAscent + cInfo.emHeightDescent + 2;
            this.#firstText = false;
          }

          let str = token.content;
          if (this.#list) {
            if (this.#listCount !== -1) {
              str = `${this.#listCount}. ${str}`;
            } else {
              str = `\u2022 ${str}`;
            }
          }

          this.#currentLineMaxHeight = 0;
          const words = str.replace(/\n/g, ' \\n ').split(/\s/);
          if (this.#heading && this.#headingPre) {
            words.unshift(this.#headingPre);
          }
          if (this.#heading && this.#headingPost) {
            words.push(this.#headingPost);
          }
          // console.log(2, words);
          words.forEach((w, idx) => {
            if (w === '\\n') {
              this.#currentWidth = this.#blockQuote ? this.#blockQuoteIndent : 0;
              this.#currentHeight += this.#currentLineMaxHeight;
              return;
            }

            const wInfo = canvasCtx.measureText(w);
            if (this.#currentWidth + wInfo.width + spWidth < this.body.w) {
              if (wInfo.emHeightAscent + wInfo.emHeightDescent + 2 > this.#currentLineMaxHeight) {
                this.#currentLineMaxHeight = wInfo.emHeightAscent + wInfo.emHeightDescent + 2;
              }
              if (!doNotDraw) {
                this.#drawText(
                  canvasCtx,
                  w,
                  this.body.x + this.#currentWidth,
                  this.body.y + this.#currentHeight,
                  idx === words.length - 1 ? wInfo.width : wInfo.width + spWidth,
                  wInfo.emHeightAscent,
                  wInfo.emHeightDescent,
                );
              }
              this.#currentWidth += idx === words.length - 1 ? wInfo.width : wInfo.width + spWidth;
            } else {
              this.#currentWidth = this.#blockQuote ? this.#blockQuoteIndent : 0;
              this.#currentHeight += this.#currentLineMaxHeight;
              if (!doNotDraw) {
                this.#drawText(
                  canvasCtx,
                  w,
                  this.body.x + this.#currentWidth,
                  this.body.y + this.#currentHeight,
                  wInfo.width,
                  wInfo.emHeightAscent,
                  wInfo.emHeightDescent,
                );
              }
            }
          });
        }
      } else if (token.items) {
        token.items.forEach((itemTokens) => {
          this.#processTokens(canvasCtx, itemTokens, doNotDraw);
          this.#currentHeight += this.#currentLineMaxHeight;
          this.#currentWidth = this.#blockQuote ? this.#blockQuoteIndent : 0;
          if (this.#listCount !== -1) {
            this.#listCount += 1;
          }
        });
      }

      // Post token processing
      switch (token.type) {
        case 'paragraph':
          this.#currentHeight += this.#currentLineMaxHeight;
          this.#currentWidth = this.#blockQuote ? this.#blockQuoteIndent : 0;
          this.#currentHeight += this.#blockQuote ? this.#paraPadding * 2 : this.#paraPadding;
          break;
        case 'em':
          this.#baseFontStyle = this.#baseFontStyle.replace(/oblique/g, '').replace(/\s\s/g, ' ').trim();
          break;
        case 'strong':
          this.#baseFontStyle = this.#baseFontStyle.replace(/bold/g, '').replace(/\s\s/g, ' ').trim();
          break;
        case 'u':
          this.#baseFontUnderline = false;
          break;
        case 'heading':
          this.#currentHeight += this.#currentLineMaxHeight;
          this.#currentWidth = 0;
          this.#heading = false;
          break;
        case 'blockQuote':
          this.#currentHeight += this.#currentLineMaxHeight;
          this.#currentHeight += this.#blockQuotePadding;

          // eslint-disable-next-line no-param-reassign
          token.bgSize = this.#currentHeight - this.#blockQuoteStartHeight;

          if (!doNotDraw) {
            canvasCtx.beginPath();
            canvasCtx.fillStyle = this.#blockQuoteForeground;
            if (token.mode === 'info') {
              canvasCtx.fillStyle = this.#blockQuoteInfoForeground;
            }
            if (token.mode === 'warn') {
              canvasCtx.fillStyle = this.#blockQuoteWarnForeground;
            }
            canvasCtx.fillRect(
              this.body.x,
              this.#blockQuoteStartHeight,
              this.#blockQuoteBarWidth,
              this.#currentHeight - this.#blockQuoteStartHeight,
            );
          }

          this.#currentHeight += this.#paraPadding * 2;
          this.#currentWidth = 0;
          this.#blockQuote = false;
          break;
        case 'list':
          this.#list = false;
          this.#listCount = 0;
          this.#currentHeight += this.#listPadding;
          this.#currentWidth = 0;
          break;
        case 'codeBlock':
          this.#currentHeight += this.#currentLineMaxHeight;
          this.#currentWidth = 0;
          this.#codeBlock = false;
          this.#currentHeight += this.#codeBlockPadding;
          break;
        case 'inlineCode':
          this.#inlineCode = false;
          break;
        case 'hr':
          this.#currentHeight += this.#paraPadding;
          this.#currentWidth = 0;
          break;
        case 'newline':
          if (!this.#firstText) {
            this.#currentHeight += 5;
          }
          break;
        default:
          break;
      }
    });
  }

  _draw(canvasCtx, depth = 0) {
    if (this.constructor.name === 'Text') {
      this._logme(depth);
    }

    canvasCtx.drawImage(
      this.#view,
      0,
      this.#scroll,
      this.body.w,
      this.body.h,
      this.body.x,
      this.body.y,
      this.body.w,
      this.body.h,
    );

    super._draw(canvasCtx, depth);
  }
}
