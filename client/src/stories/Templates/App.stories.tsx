import { Story, Meta } from '@storybook/react/types-6-0';

// Decorators
import MswDecorator, { mswParameters } from '../../../.storybook/decorators/MswDecorator';
import ThemeDecoratorNoStyle from '../../../.storybook/decorators/ThemeDecoratorNoStyle';

// Components
import App from '../../App';

export default {
  title: 'Templates/App',
  component: App,
  decorators: [ThemeDecoratorNoStyle, MswDecorator]
} as Meta;

export const Template: Story = () => <App />;
Template.parameters = mswParameters;