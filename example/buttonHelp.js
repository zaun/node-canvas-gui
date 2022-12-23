import {
  Button,
  Colors,
  Container,
  Panel,
  Text,
} from '../src/index.js';

export default () => {
  // Split the screen for a top tab bar
  const screen = new Container(null, 'SCREEN');
  screen.orientation = Container.Orientation.Vertical;

  const intro = new Text(null, 'TEXT');
  intro.parent = screen;
  intro.baseFontColor = Colors.Black;
  intro.autoHeight = true;
  intro.text = `# Buttons
  
Use custom button styles for actions in forms, dialogs, and more with support for multiple sizes, states, and more.



# Examples`;
  const example = new Container();
  example.spacing = 0;
  example.padding = 0;
  example.orientation = Container.Orientation.Vertical;
  example.parent = screen;

  const exampleContentPanel = new Panel();
  exampleContentPanel.spacing = 0;
  exampleContentPanel.padding = 5;
  exampleContentPanel.radii = [8, 8, 0, 0];
  exampleContentPanel.setColor(Colors.White);
  exampleContentPanel.fixedHeight = 110;
  exampleContentPanel.parent = example;

  const exampleContent = new Container();
  exampleContent.spacing = 0;
  exampleContent.orientation = Container.Orientation.Vertical;
  exampleContent.parent = exampleContentPanel;

  const bar1 = new Container(exampleContent, 'BAR1');
  bar1.orientation = Container.Orientation.Horizontal;
  bar1.justifyItems = Container.JustifyItems.Center;

  const bar2 = new Container(exampleContent, 'BAR2');
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

  const exampleCodePanel = new Panel();
  exampleCodePanel.spacing = 0;
  exampleCodePanel.padding = 5;
  exampleCodePanel.radii = [0, 0, 8, 8];
  exampleCodePanel.setColor(Colors.darker(Colors.White));
  exampleCodePanel.borderColor = exampleContentPanel.borderColor;
  exampleCodePanel.fixedHeight = 110;
  exampleCodePanel.parent = example;

  const exampleCode = new Text(null, 'TEXT');
  exampleCodePanel.fixedHeight = exampleCode;
  exampleCode.parent = exampleCodePanel;
  exampleCode.baseFontColor = Colors.Black;
  exampleCode.autoHeight = true;
  exampleCode.text = `\`\`\`
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
\`\`\``;

  return screen;
};
