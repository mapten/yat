import { Meta, Story } from '@storybook/react/types-6-0';

// Decorators
import ThemeDecorator from '../../../.storybook/decorators/ThemeDecorator';
import MswDecorator, { mswParameters } from '../../../.storybook/decorators/MswDecorator';

// Components
import Auth from '../../components/containers/Auth/Auth';

export default {
  title: 'Organisms/Auth',
  component: Auth,
  decorators: [
    ThemeDecorator,
    MswDecorator
  ]
} as Meta;

export const Template: Story = () => <Auth />;
Template.parameters = mswParameters;