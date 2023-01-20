import {
  Button,
  Colors,
  Container,
  ScrollView,
  Text,
} from '../../src/index.js';
import util from './util.js';

export default () => {
  const screen = new ScrollView(null, 'Scroll');

  // Split the view for a top tab bar
  const view = new Container();
  view.orientation = Container.Orientation.Vertical;
  view.autoHeight = true;

  const sectionA = new Text();
  sectionA.parent = view;
  sectionA.baseFontColor = Colors.Black;
  sectionA.autoHeight = true;
  sectionA.text = `# Buttons
  
Use custom button styles for actions in forms, dialogs, and more with support for multiple sizes, states, and more.

## Examples`;

  const exampleAButtons = new Container();
  exampleAButtons.orientation = Container.Orientation.Vertical;
  exampleAButtons.spacing = 5;
  exampleAButtons.padding = 5;
  exampleAButtons.autoHeight = true;
  // exampleAButtons.parent = view;

  const bar1 = new Container(exampleAButtons);
  bar1.orientation = Container.Orientation.Horizontal;
  bar1.justifyItems = Container.JustifyItems.Center;
  bar1.autoHeight = true;

  const bar2 = new Container(exampleAButtons);
  bar2.orientation = Container.Orientation.Horizontal;
  bar2.justifyItems = Container.JustifyItems.Center;
  bar2.autoHeight = true;

  ['Blue', 'Cyan', 'Green', 'Indigo', 'Orange', 'Pink'].forEach((c) => {
    const b = new Button(bar1);
    b.text = c;
    b.fixedWidth = 100;
    b.setColor(Colors[c]);
  });

  ['Purple', 'Red', 'Teal', 'Gray', 'Black', 'White'].forEach((c) => {
    const b = new Button(bar2);
    b.text = c;
    b.fixedWidth = 100;
    b.setColor(Colors[c]);
  });

  const exampleA = util.createExample(
    exampleAButtons,
    `
\`\`\`
const bar1 = new Container(parent, 'BAR1');
bar1.orientation = Container.Orientation.Horizontal;
bar1.justifyItems = Container.JustifyItems.Center;

const bar2 = new Container(parent, 'BAR2');
bar2.orientation = Container.Orientation.Horizontal;
bar2.justifyItems = Container.JustifyItems.Center;

['Blue', 'Cyan', 'Green', 'Indigo', 'Orange', 'Pink'].forEach((c) => {
  const b = new Button(bar1);
  b.text = c;
  b.fixedWidth = 100;
  b.setColor(Colors[c]);
});

['Purple', 'Red', 'Teal', 'Gray', 'Black', 'White'].forEach((c) => {
  const b = new Button(bar2);
  b.text = c;
  b.fixedWidth = 100;
  b.setColor(Colors[c]);
});
\`\`\`
    `,
  );
  exampleA.parent = view;

  const sectionB = new Text();
  sectionB.parent = view;
  sectionB.baseFontColor = Colors.Black;
  sectionB.autoHeight = true;
  sectionB.text = `## Outline buttons
  
In need of a button, but not the hefty background colors they bring? Set the mode property to Button.Mode.Outline to remove all background images and colors on any button.
`;

  const exampleBButtons = new Container();
  exampleBButtons.orientation = Container.Orientation.Vertical;
  exampleBButtons.spacing = 5;
  exampleBButtons.padding = 5;
  exampleBButtons.autoHeight = true;

  const barB1 = new Container(exampleBButtons);
  barB1.orientation = Container.Orientation.Horizontal;
  barB1.justifyItems = Container.JustifyItems.Center;
  barB1.autoHeight = true;

  const barB2 = new Container(exampleBButtons);
  barB2.orientation = Container.Orientation.Horizontal;
  barB2.justifyItems = Container.JustifyItems.Center;
  barB2.autoHeight = true;

  ['Blue', 'Cyan', 'Green', 'Indigo', 'Orange', 'Pink'].forEach((c) => {
    const b = new Button(barB1);
    b.text = c;
    b.fixedWidth = 100;
    b.mode = Button.Mode.Outline;
    b.setColor(Colors[c]);
  });

  ['Purple', 'Red', 'Teal', 'Gray', 'Black', 'White'].forEach((c) => {
    const b = new Button(barB2);
    b.text = c;
    b.fixedWidth = 100;
    b.mode = Button.Mode.Outline;
    b.setColor(Colors[c]);
  });

  const exampleB = util.createExample(
    exampleBButtons,
    `
\`\`\`
const bar1 = new Container(parent, 'BAR1');
bar1.orientation = Container.Orientation.Horizontal;
bar1.justifyItems = Container.JustifyItems.Center;

const bar2 = new Container(parent, 'BAR2');
bar2.orientation = Container.Orientation.Horizontal;
bar2.justifyItems = Container.JustifyItems.Center;

['Blue', 'Cyan', 'Green', 'Indigo', 'Orange', 'Pink'].forEach((c) => {
  const b = new Button(bar1);
  b.text = c;
  b.fixedWidth = 100;
  b.mode = Button.Mode.Outline;
  b.setColor(Colors[c]);
});

['Purple', 'Red', 'Teal', 'Gray', 'Black', 'White'].forEach((c) => {
  const b = new Button(bar2);
  b.text = c;
  b.fixedWidth = 100;
  b.mode = Button.Mode.Outline;
  b.setColor(Colors[c]);
});
\`\`\`
    `,
  );
  exampleB.parent = view;

  const sectionC = new Text();
  sectionC.parent = view;
  sectionC.baseFontColor = Colors.Black;
  sectionC.autoHeight = true;
  sectionC.text = `## Sizes
  
  Fancy larger or smaller buttons?
`;

  const exampleCButtons = new Container();
  exampleCButtons.orientation = Container.Orientation.Horizontal;
  exampleCButtons.justifyItems = Container.JustifyItems.Center;
  exampleCButtons.padding = 5;
  exampleCButtons.autoHeight = true;

  ['Large', 'Medium', 'Small'].forEach((s) => {
    const b = new Button(exampleCButtons);
    b.text = s;
    b.fixedWidth = 100;
    b.setSize(Button.Size[s]);
    b.setColor(Colors.Blue);
  });

  const exampleC = util.createExample(
    exampleCButtons,
    `
\`\`\`
const exampleCButtons = new Container();
exampleCButtons.orientation = Container.Orientation.Horizontal;
exampleCButtons.justifyItems = Container.JustifyItems.Center;
exampleCButtons.padding = 5;
exampleCButtons.autoHeight = true;

['Large', 'Medium', 'Small'].forEach((s) => {
  const b = new Button(exampleCButtons);
  b.text = s;
  b.fixedWidth = 100;
  b.setSize(Button.Size[s]);
  b.setColor(Colors.Blue);
});
\`\`\`
    `,
  );
  exampleC.parent = view;

  screen.child = view;
  return screen;
};
