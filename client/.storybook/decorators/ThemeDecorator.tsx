import { Story, Meta } from '@storybook/react/types-6-0';

// Styles
import '../../src/App.scss';

// Decorators
import ThemeDecoratorNoStyle from './ThemeDecoratorNoStyle';

const ThemeDecorator = (Story: Story, context: Meta) => {
  return ThemeDecoratorNoStyle(Story, context);
}

export default ThemeDecorator;