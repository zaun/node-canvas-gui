import {
  Container,
  Colors,
  Panel,
  Text,
} from '../src/index.js';

const createExample = (exampleWidget, exampleCode) => {
  const example = new Container();
  example.spacing = 0;
  example.padding = 0;
  example.autoHeight = true;
  example.orientation = Container.Orientation.Vertical;

  const exampleContentPanel = new Panel(null, 'ExampleContentPanel');
  exampleContentPanel.spacing = 0;
  exampleContentPanel.padding = 5;
  exampleContentPanel.radii = [8, 8, 0, 0];
  exampleContentPanel.setColor(Colors.White);
  exampleContentPanel.autoHeight = true;
  exampleContentPanel.parent = example;

  const exampleContent = new Container(null, 'ExampleContent');
  exampleContent.spacing = 0;
  exampleContent.orientation = Container.Orientation.Vertical;
  exampleContent.parent = exampleContentPanel;
  exampleContent.autoHeight = true;

  if (exampleWidget !== null) {
    // eslint-disable-next-line no-param-reassign
    exampleWidget.parent = exampleContent;
  }

  const exampleCodePanel = new Panel(null, 'ExampleCodePanel');
  exampleCodePanel.spacing = 0;
  exampleCodePanel.padding = 5;
  exampleCodePanel.radii = [0, 0, 8, 8];
  exampleCodePanel.setColor(Colors.darker(Colors.White));
  exampleCodePanel.borderColor = exampleContentPanel.borderColor;
  exampleCodePanel.autoHeight = true;
  exampleCodePanel.parent = example;

  const exampleText = new Text(null, 'ExampleText');
  exampleCodePanel.fixedHeight = exampleText;
  exampleText.parent = exampleCodePanel;
  exampleText.baseFontColor = Colors.Black;
  exampleText.autoHeight = true;
  exampleText.text = exampleCode;

  return example;
};

export default { createExample };
